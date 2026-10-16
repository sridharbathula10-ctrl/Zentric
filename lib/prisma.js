
import mysql from "mysql2/promise";

const globalForDb = globalThis;

function createPool() {
  const databaseUrl = process.env.DATABASE_URL;

  let config;

  if (databaseUrl) {
    const url = new URL(databaseUrl);

    config = {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.slice(1)),
    };
  } else {
    config = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
  }

  if (
    !config.host ||
    !config.user ||
    !config.password ||
    !config.database
  ) {
    throw new Error("Database environment variables are missing");
  }

  if (
    config.host === "localhost" ||
    config.host === "127.0.0.1"
  ) {
    throw new Error("Production must use the Railway MySQL hostname");
  }

  return mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

const pool =
  globalForDb.zentricPool || createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.zentricPool = pool;
}
