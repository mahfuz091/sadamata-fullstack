module.exports = {
  apps: [
    {
      name: "merch-sadamata",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
}
