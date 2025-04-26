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
    return document.exists() ? document.data() : null;
  }

  async setDocument(collectionName, id, data) {
    return setDoc(this.getDocumentRef(collectionName, id), data);
  }

  async updateDocument(collectionName, id, data) {
    return updateDoc(this.getDocumentRef(collectionName, id), data);
  }

  async deleteDocument(collectionName, id) {
    return deleteDoc(this.getDocumentRef(collectionName, id));
  }

  async addDocument(collectionName, data) {
    return addDoc(collection(db, collectionName), data);
  }

  async queryDocuments(collectionName, field, operator, value) {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  }

  async getCollection(collectionName) {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      data: docSnap.data(),
    }));
  }
}

module.exports = new FirestoreService();
