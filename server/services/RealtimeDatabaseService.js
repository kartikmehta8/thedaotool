const { rtdb } = require('../utils/firebase');
const { ref, remove, set, update, get, child } = require('firebase/database');

class RealtimeDatabaseService {
  getRef(path) {
    return ref(rtdb, path);
  }

  async setData(path, data) {
    const reference = this.getRef(path);
    await set(reference, data);
  }

  async updateData(path, data) {
    const reference = this.getRef(path);
    await update(reference, data);
  }

  async removeData(path) {
    const reference = this.getRef(path);
    await remove(reference);
  }

  async getData(path) {
    const snapshot = await get(this.getRef(path));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  }

  async getChildData(path, childPath) {
    const snapshot = await get(child(this.getRef(path), childPath));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  }
}

module.exports = new RealtimeDatabaseService();
