const { rtdb } = require('../utils/firebase');

class RealtimeDatabaseService {
  getRef(path) {
    return rtdb.ref(path);
  }

  async setData(path, data) {
    const reference = this.getRef(path);
    await reference.set(data);
  }

  async updateData(path, data) {
    const reference = this.getRef(path);
    await reference.update(data);
  }

  async removeData(path) {
    const reference = this.getRef(path);
    await reference.remove();
  }

  async getData(path) {
    const snapshot = await this.getRef(path).once('value');
    return snapshot.exists() ? snapshot.val() : null;
  }

  async getChildData(path, childPath) {
    const snapshot = await this.getRef(path).child(childPath).once('value');
    return snapshot.exists() ? snapshot.val() : null;
  }
}

module.exports = new RealtimeDatabaseService();
