module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { lines: 80 }
  },
  moduleNameMapper: {
    '^@controllers(.*)$': '<rootDir>/controllers$1',
    '^@middlewares(.*)$': '<rootDir>/middlewares$1',
    '^@routes(.*)$': '<rootDir>/routes$1',
    '^@services(.*)$': '<rootDir>/services$1',
    '^@utils(.*)$': '<rootDir>/utils$1',
    '^@validators(.*)$': '<rootDir>/validators$1',
    '^@cron(.*)$': '<rootDir>/cron$1',
    '^@queues(.*)$': '<rootDir>/queues$1'
  }
};
