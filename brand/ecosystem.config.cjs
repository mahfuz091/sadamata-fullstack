module.exports = {
  apps: [
    {
      name: "brand-sadamata",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3002
      }
    }
  ]
}
