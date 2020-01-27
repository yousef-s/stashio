module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "globals": {
    'ts-jest': {
      diagnostics: false,
    }
  },
  "coverageThreshold": {
    "./src/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}