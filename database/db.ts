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
  // Temporary debug log - redact sensitive parts
  if (MONGODB_URL) {
    const url = MONGODB_URL;
    const redactedUrl = url.replace(
      /(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/,
      "$1***:***@"
    );

    // Check if connection string has proper SSL parameters
    if (
      url.includes("mongodb+srv://") &&
      !url.includes("ssl=true") &&
      !url.includes("tls=true")
    ) {
    }
  } else {
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

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
  } else {
    // Local MongoDB options
    Object.assign(connectionOptions, {
      ssl: false,
      tls: false,
    });
  }

  cached.promise =
    cached.promise || mongoose.connect(MONGODB_URL, connectionOptions);

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("Database connection failed:", error);
    // Reset the promise on failure
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};
