module.exports = {
  apps: [
    {
      name: "sadamata",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
