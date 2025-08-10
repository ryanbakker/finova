import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDB = async () => {
  console.log("connectToDB called");
  console.log("MONGODB_URL exists:", !!MONGODB_URL);

  // Temporary debug log - redact sensitive parts
  if (MONGODB_URL) {
    const url = MONGODB_URL;
    const redactedUrl = url.replace(
      /(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/,
      "$1***:***@"
    );
    console.log("MONGODB_URL (redacted):", redactedUrl);

    // Check if connection string has proper SSL parameters
    if (
      url.includes("mongodb+srv://") &&
      !url.includes("ssl=true") &&
      !url.includes("tls=true")
    ) {
      console.log(
        "Warning: MongoDB Atlas connection string detected without explicit SSL parameters"
      );
    }
  } else {
    console.log("MONGODB_URL is undefined");
  }

  if (cached.conn) {
    console.log("Using cached connection");
    return cached.conn;
  }

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  console.log("Creating new database connection...");

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
    console.log("Using MongoDB Atlas SSL configuration");
  } else {
    // Local MongoDB options
    Object.assign(connectionOptions, {
      ssl: false,
      tls: false,
    });
    console.log("Using local MongoDB configuration");
  }

  console.log(
    "Connection options:",
    JSON.stringify(connectionOptions, null, 2)
  );

  cached.promise =
    cached.promise || mongoose.connect(MONGODB_URL, connectionOptions);

  try {
    cached.conn = await cached.promise;
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Reset the promise on failure
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};
