import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  // For ESM support
  transform: {},
  extensionsToTreatAsEsm: ['.ts']
};

export default config;
