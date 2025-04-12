const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
const numCPUs = 1; // For testing purposes, set to 1.

module.exports = function clusterMiddleware(app) {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      cluster.fork();
    });
  } else {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 {${process.pid}}:${process.env.PORT}`);
    });
  }
};
