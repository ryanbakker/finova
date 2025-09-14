import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDB = async () => {
  const startTime = Date.now();

  try {
    console.log(`[DATABASE] Starting database connection`, {
      timestamp: new Date().toISOString(),
    });

    // Temporary debug log - redact sensitive parts
    if (MONGODB_URL) {
      const url = MONGODB_URL;
      const redactedUrl = url.replace(
        /(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/,
        "$1***:***@"
      );

      console.log(`[DATABASE] Using MongoDB URL`, {
        redactedUrl,
        isAtlas: url.includes("mongodb+srv://"),
        timestamp: new Date().toISOString(),
      });

      // Check if connection string has proper SSL parameters
      if (
        url.includes("mongodb+srv://") &&
        !url.includes("ssl=true") &&
        !url.includes("tls=true")
      ) {
        console.warn(
          `[DATABASE] MongoDB Atlas connection without explicit SSL/TLS parameters`,
          {
            timestamp: new Date().toISOString(),
          }
        );
      }
    } else {
      console.error(`[DATABASE] MONGODB_URL environment variable not set`, {
        timestamp: new Date().toISOString(),
      });
    }

    if (cached.conn) {
      console.log(`[DATABASE] Using existing connection`, {
        timestamp: new Date().toISOString(),
      });
      return cached.conn;
    }

    if (!MONGODB_URL) {
      console.error(`[DATABASE] Missing MONGODB_URL environment variable`, {
        timestamp: new Date().toISOString(),
      });
      throw new Error("Missing MONGODB_URL");
    }

    // Parse the connection string to check if it's MongoDB Atlas
    const isAtlas = MONGODB_URL.includes("mongodb+srv://");

    const connectionOptions: any = {
      dbName: "InstantAI",
      bufferCommands: false,
      // Connection options to handle SSL issues
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // Retry options
      retryWrites: true,
      w: "majority" as any,
    };

    // Add SSL options based on connection type
    if (isAtlas) {
      // MongoDB Atlas specific options
      Object.assign(connectionOptions, {
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        // Atlas specific SSL options
        sslCA: undefined,
        sslCert: undefined,
        sslKey: undefined,
        sslPass: undefined,
      });
      console.log(`[DATABASE] Using Atlas connection with SSL/TLS`, {
        timestamp: new Date().toISOString(),
      });
    } else {
      // Local MongoDB options
      Object.assign(connectionOptions, {
        ssl: false,
        tls: false,
      });
      console.log(`[DATABASE] Using local MongoDB connection`, {
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`[DATABASE] Establishing new connection`, {
      isAtlas,
      connectionOptions: {
        dbName: connectionOptions.dbName,
        maxPoolSize: connectionOptions.maxPoolSize,
        serverSelectionTimeoutMS: connectionOptions.serverSelectionTimeoutMS,
        socketTimeoutMS: connectionOptions.socketTimeoutMS,
      },
      timestamp: new Date().toISOString(),
    });

    cached.promise =
      cached.promise || mongoose.connect(MONGODB_URL, connectionOptions);

    try {
      cached.conn = await cached.promise;

      const responseTime = Date.now() - startTime;
      console.log(`[DATABASE] Connection established successfully`, {
        responseTime: `${responseTime}ms`,
        readyState: cached.conn.connection.readyState,
        host: cached.conn.connection.host,
        port: cached.conn.connection.port,
        name: cached.conn.connection.name,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`[DATABASE] Connection failed`, {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      });

      // Reset the promise on failure
      cached.promise = null;
      throw error;
    }

    return cached.conn;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[DATABASE] Database connection error`, {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};
