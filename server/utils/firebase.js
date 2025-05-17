const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FB_REALTIME_DATABASE,
  storageBucket: process.env.FB_STORAGE_BUCKET,
});

const auth = admin.auth();
const db = admin.firestore();
const rtdb = admin.database();

module.exports = { auth, db, rtdb };
