const fs = require('fs');
const path = require('path');

class CronManager {
  constructor() {
    this.jobs = this.loadJobs();
  }

  loadJobs() {
    const jobs = [];
    const implementationsPath = path.join(__dirname, 'implementations');
    const files = fs.readdirSync(implementationsPath);

    files.forEach((file) => {
      const JobClass = require(path.join(implementationsPath, file));
      const instance = new JobClass();
      jobs.push(instance);
    });

    return jobs;
  }

  scheduleJobs() {
    this.jobs.forEach((job) => {
      job.schedule();
    });
  }
}

module.exports = CronManager;
