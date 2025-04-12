const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getDatabase } = require('firebase/database');
const dotenv = require('dotenv');

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MSG_SENDER_ID,
  appId: process.env.FB_APP_ID,
  databaseURL: process.env.FB_REALTIME_DATABASE,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

module.exports = { auth, db, rtdb };
