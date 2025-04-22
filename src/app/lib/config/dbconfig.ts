const config = {
  // user: "sa",
  // password: "m@tco123",
  // server: "MALI-PC\\MSSQLSERVER2016",
  // database: "AdminDashboard",

  user: "ali",
  password: "m@tco123",
  server: "192.168.11.24\\DBSVR",
  database: "AdminDashboard",
  multipleStatements: true,

  driver: "tedious",
  connectionLimit: 500,
  pool: {
    max: 500,
    min: 0,
    idleTimeoutMillis: 30000,
  },

  options: {
    encrypt: false,
    trustedconnection: true,
    enableArithAbort: true,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
    },
  },
  requestTimeout: 2500000,
};

module.exports = config;
