const env = {
  NODE_ENV: "test",
  PINO_OPTIONS: "{}",
  PORT: "8080",
  ROOT: "/",
  SECRET: "secret",
};

process.env = { ...process.env, ...env };

export {};
