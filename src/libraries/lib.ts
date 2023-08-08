// Check variables
import { config } from './env/convict.js';
import { AppError } from './error/errorObject.js';

export function validateEnvironment() {
  // Loading Config
  try {
    const env = config.get('env');
    config.loadFile(`./config/${env}.json`);

    console.log(`Service starting in ${env} mode.`);
  } catch (error) {
    throw new AppError(
      'INITIALIZATION_ERROR',
      'No configuration file found',
      error,
    );
  }
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
