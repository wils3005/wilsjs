module.exports = {
  apps: [
    {
      name: "wilsjs-lambda",
      script: "npm",
      args: "run offline",
    },
    {
      name: "build wilsjs-lambda",
      script: "npm",
      args: "run build",
      watch: true,
    },
  ],
};
