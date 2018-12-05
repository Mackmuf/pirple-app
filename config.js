/*
 * Config file
 */ 

// Container for all environments
const env = {};

// Development (default env)
env.development = {
  'httpport': 3000,
  'httpsport': 3001,
  'envName': 'development'
};

// Production environment
env.production = {
  'httpport': 5000,
  'httpsport': 5001,
  'envName': 'production'
}

// Determine which environment was passed as cmd line arg
var curEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// prepare the right environment to export
const envToExport = typeof(env[curEnv]) == 'object' ? env[curEnv] : env.development;

module.exports = envToExport;