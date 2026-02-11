/**
 * Configuration for Computer Use Agent
 */

export const CONFIG = {
  // E2B Configuration
  e2b: {
    timeout: 30000, // 30 seconds
    maxRetries: 3,
  },

  // Model Configuration (MiniMax M2.1 via OpenCode Zen)
  model: {
    name: "minimax-m2.1-free",
    maxTokens: 4096,
    temperature: 0,
  },

  // Desktop Configuration
  desktop: {
    screenshotWaitMs: 1000,
    appLaunchWaitMs: 3000,
    screenshotFormat: "png",
  },

  // Agent Configuration
  agent: {
    verbose: true,
    saveScreenshots: false,
    screenshotDir: "./screenshots",
  },

  // Task Configuration
  task: {
    maxSteps: 50,
    stepTimeoutMs: 30000,
  },
};

export default CONFIG;
