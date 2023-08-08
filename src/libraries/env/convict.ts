import convict from 'convict';

// Schema
export const config = convict({
  env: {
    doc: 'Application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'Binding IP address',
    format: '*',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'Binding port',
    format: 'port',
    default: 5000,
    env: 'PORT',
    arg: 'port',
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
  },
  db: {
    host: {
      doc: 'Database host address',
      format: '*',
      default: 'http://localhost/',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: '6379',
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'Redis Cache',
    },
  },
});

// Environment dependant config
const env = config.get('env');
config.loadFile(`./config/${env}.json`);

// Validation
config.validate({ allowed: 'strict' });
