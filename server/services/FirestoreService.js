const { auth, db } = require('../utils/firebase');
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require('firebase/auth');
const {
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} = require('firebase/firestore');
const EncryptionService = require('./EncryptionService');

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
  // Auth related.
  async login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Firestore CRUD.
  getDocumentRef(collectionName, id) {
    return doc(db, collectionName, id);
  }

  async getDocument(collectionName, id) {
    const document = await getDoc(this.getDocumentRef(collectionName, id));
    return document.exists() ? decryptSensitiveFields(document.data()) : null;
  }

  async setDocument(collectionName, id, data) {
    return setDoc(
      this.getDocumentRef(collectionName, id),
      encryptSensitiveFields(data)
    );
  }

  async updateDocument(collectionName, id, data) {
    return updateDoc(
      this.getDocumentRef(collectionName, id),
      encryptSensitiveFields(data)
    );
  }

  async deleteDocument(collectionName, id) {
    return deleteDoc(this.getDocumentRef(collectionName, id));
  }

  async addDocument(collectionName, data) {
    return addDoc(collection(db, collectionName), encryptSensitiveFields(data));
  }

  async queryDocuments(collectionName, field, operator, value) {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...decryptSensitiveFields(docSnap.data()),
    }));
  }

  async getCollection(collectionName) {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...decryptSensitiveFields(docSnap.data()),
    }));
  }
}

module.exports = new FirestoreService();
