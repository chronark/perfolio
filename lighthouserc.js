module.exports = {
  ci: {
    collect: {
      startServerCommand: "yarn start",
      startServerReadyTimeout: 3 * 60 * 1000,
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
  assert: {
    preset: "lighthouse:recommend",
    assertions: {
      "categories:performance": ["error", { minScore: 0.9 }],
      "categories:accessibility": ["error", { minScore: 0.9 }],
      "categories:best-practices": ["error", { minScore: 0.9 }],
      "categories:seo": ["error", { minScore: 0.9 }],
    },
  },
}