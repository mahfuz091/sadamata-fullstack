// Root pm2 config - runs all 4 Sadamata apps.
// Each app also has its own ecosystem.config.cjs (dashboard does not); this one supersedes them.
//   pm2 start ecosystem.config.cjs
//   pm2 restart ecosystem.config.cjs
//   pm2 logs
const path = require("path");

const app = (name, dir, port) => ({
  name,
  cwd: path.join(__dirname, dir),
  script: "npm",
  args: `run start -- --port ${port}`,
  env: { NODE_ENV: "production", PORT: String(port) },
});

module.exports = {
  apps: [
    app("sadamata", "frontend", 3000),
    app("merch-sadamata", "merchant", 3001),
    app("brand-sadamata", "brand", 3002),
    app("admin-sadamata", "dashboard", 3003),
  ],
};
