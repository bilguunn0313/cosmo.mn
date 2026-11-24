const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "cosmo-api",
      cwd: path.join(__dirname, "apps/api"),
      script: path.join(__dirname, "apps/api/dist/main.js"),
      env: { NODE_ENV: "production" },
    },
    {
      name: "cosmo-web",
      cwd: path.join(__dirname, "apps/web"),
      script: path.join(__dirname, "node_modules/next/dist/bin/next"),
      args: "start --hostname 127.0.0.1 --port 3000",
      env: { NODE_ENV: "production" },
    },
  ],
};
