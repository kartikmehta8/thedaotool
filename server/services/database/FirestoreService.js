const { auth, db } = require('../../utils/firebase');
const EncryptionService = require('../misc/EncryptionService');

const SENSITIVE_KEYS = ['discordAccessToken', 'githubToken'];

function encryptSensitiveFields(data) {
  const encrypted = { ...data };
  for (const key of SENSITIVE_KEYS) {
    if (data[key]) {
      encrypted[key] = EncryptionService.encrypt(data[key]);
    }
  }
  return encrypted;
}

function decryptSensitiveFields(data) {
  const decrypted = { ...data };
  for (const key of SENSITIVE_KEYS) {
    if (data[key]) {
      decrypted[key] = EncryptionService.decrypt(data[key]);
    }
  }
  return decrypted;
}

class FirestoreService {
  async verifyIdToken(idToken) {
    return auth.verifyIdToken(idToken);
  }

  async getUserByEmail(email) {
    return auth.getUserByEmail(email);
  }

  async createUser(email, password) {
    return auth.createUser({ email, password });
  }

  async deleteUser(uid) {
    return auth.deleteUser(uid);
  }

  getDocumentRef(collectionName, id) {
    return db.collection(collectionName).doc(id);
  }

  async getDocument(collectionName, id) {
    const docSnap = await this.getDocumentRef(collectionName, id).get();
    return docSnap.exists ? decryptSensitiveFields(docSnap.data()) : null;
  }

  async setDocument(collectionName, id, data) {
    return this.getDocumentRef(collectionName, id).set(
      encryptSensitiveFields(data),
      { merge: false }
    );
  }

  async updateDocument(collectionName, id, data) {
    return this.getDocumentRef(collectionName, id).update(
      encryptSensitiveFields(data)
    );
  }

  async deleteDocument(collectionName, id) {
    return this.getDocumentRef(collectionName, id).delete();
  }

  async addDocument(collectionName, data) {
    return db.collection(collectionName).add(encryptSensitiveFields(data));
  }

  async queryDocuments(collectionName, field, operator, value) {
    const snapshot = await db
      .collection(collectionName)
      .where(field, operator, value)
      .get();

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...decryptSensitiveFields(docSnap.data()),
    }));
  }

  async getCollection(collectionName) {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...decryptSensitiveFields(docSnap.data()),
    }));
  }
}

module.exports = new FirestoreService();
