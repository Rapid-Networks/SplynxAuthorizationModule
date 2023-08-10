import convict from 'convict';
import { AppError } from './errors.js';
// Schema
const config = convict({
  env: {
    doc: 'Application environment',
    format: ['production', 'development', 'testing'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env',
  },
  server: {
    ip: {
      doc: 'Binding IP address',
      format: '*',
      default: '127.0.0.1',
      env: 'IP_ADDRESS',
    },
    port: {
      doc: 'Binding port',
      format: 'port',
      default: 3000,
      env: 'PORT',
      arg: 'port',
    },
  },
  splynx: {
    url: {
      doc: 'Splynx host url',
      format: '*',
      default: '',
      env: 'SPLYNX_URL',
    },
    key: {
      doc: 'Splynx API Key',
      format: String,
      default: '',
      env: 'SPLYNX_API_KEY',
    },
    secret: {
      doc: 'Splynx API Secret',
      format: String,
      default: '',
      env: 'SPLYNX_API_SECRET',
    },
    interval: {
      doc: 'Splynx request interval in milliseconds',
      format: 'int',
      default: 1800000,
      env: 'SPLYNX_INTERVAL',
      arg: 'interval',
    },
  },
  db: {
    host: {
      doc: 'Database host address',
      format: '*',
      default: 'http://localhost/',
      env: 'DB_HOST',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: '6379',
      env: 'dB_PORT',
    },
  },
});

// Load config
try {
  const env = config.get('env');
  if (env === 'production') {
    config.loadFile('./opt/Splynx_Authentication/config/environment.json');
  }
  config.loadFile(`./config/${env}.json`);

  console.log(`Service starting in ${env} mode.`);
} catch (error) {
  throw new AppError(
    'INITIALIZATION_ERROR',
    'No configuration file found',
    error,
  );
}

// Config Validation
try {
  config.validate({ allowed: 'strict' });
} catch (error) {
  throw new AppError(
    'INITIALIZATION_ERROR',
    'Config validation failure',
    error,
  );
}

export default config;
