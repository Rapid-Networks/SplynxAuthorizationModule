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
    format: 'ipaddress',
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
});

// Environment dependant config
const env = config.get('env');
config.loadFile(`./config/${env}.json`);

// Validation
config.validate({ allowed: 'strict' });
