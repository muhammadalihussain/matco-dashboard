const sql = require("mssql");
const configuration = require("../../lib/config/dbconfig");

// const configuration = {
//   user: "ali",
//   password: "m@tco123",
//   server: "192.168.11.24\\DBSVR",
//   database: "AdminDashboard",
//   multipleStatements: true,

//   driver: "tedious",
//   connectionLimit: 500,
//   pool: {
//     max: 500,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },

//   options: {
//     encrypt: false,
//     trustedconnection: true,
//     enableArithAbort: true,
//     cryptoCredentialsDetails: {
//       minVersion: "TLSv1",
//     },
//   },
//   requestTimeout: 2500000,
// };

// // Global connection pool
// let pool: any;
// let isConnecting = false;

// async function getPool() {
//   if (pool) return pool;
//   if (isConnecting) {
//     // Wait if connection is already being established
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     return getPool();
//   }

//   isConnecting = true;
//   try {
//     pool = new sql.ConnectionPool(configuration);

//     // Configure pool settings
//     pool.config.pool = {
//       max: 10,
//       min: 0,
//       idleTimeoutMillis: 30000,
//       acquireTimeoutMillis: 30000,
//     };

//     // Add error handlers
//     pool.on("error", (err: any) => {
//       console.error("Connection pool error:", err);
//     });

//     await pool.connect();
//     console.log("Database connection pool established");
//     return pool;
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     pool = null; // Reset pool to allow retry
//     throw err;
//   } finally {
//     isConnecting = false;
//   }
// }

// Global connection pool
let pool: sql.ConnectionPool;
let poolConnectPromise: Promise<sql.ConnectionPool>;

async function getPool(): Promise<sql.ConnectionPool> {
  if (pool) return pool;
  if (poolConnectPromise) return poolConnectPromise;

  poolConnectPromise = new sql.ConnectionPool(configuration)
    .connect()
    .then((newPool) => {
      pool = newPool;
      return pool;
    })
    .catch((err) => {
      poolConnectPromise = null;
      throw err;
    });

  return poolConnectPromise;
}

async function executeStoredProcedure(procedureName: any, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  // Add all parameters
  Object.entries(params).forEach(([name, value]) => {
    const paramConfig = {
      name,
      value: value.value !== undefined ? value.value : value,
      type: value.type || sql.NVarChar,
      options: value.options || {},
    };
    request.input(name, paramConfig.type, paramConfig.value);
  });

  return await request.execute(procedureName);
}

async function executeStoredProcedureByName(procedureName: any) {
  try {
    // Create connection pool if it doesn't exist

    const pool = await getPool();

    // Execute the stored procedure
    const result = await pool.request().execute(procedureName);

    return result.recordset;
  } catch (error) {
    console.error(`Error executing ${procedureName}:`, error);
    throw error;
  }
}

// Graceful shutdown handler
async function closePool() {
  if (pool) {
    try {
      await pool.close();
      console.log("Connection pool closed");
    } catch (err) {
      console.error("Error closing connection pool:", err);
    }
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  if (pool) {
    try {
      await pool.close();
      console.log("Connection pool closed");
    } catch (err) {
      console.error("Error closing pool:", err);
    }
  }
  process.exit(0);
});

module.exports = {
  getPool,
  executeStoredProcedure,
  executeStoredProcedureByName,
  closePool,
  sql, // Export sql for access to data types
};
