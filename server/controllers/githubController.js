// ======= controllers/githubController.js =======
const axios = require('axios');
const { db } = require('../utils/firebase');
const { doc, updateDoc, getDoc } = require('firebase/firestore');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/github/callback`;

const initiateOAuth = (req, res) => {
  const { userId } = req.query;
  const redirect = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}&state=${userId || ''}`;
  res.redirect(redirect);
};

const handleCallback = async (req, res) => {
  const { code, state } = req.query;

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { accept: 'application/json' },
      }
    );

    const { access_token } = response.data;

    if (state && access_token) {
      await updateDoc(doc(db, 'businesses', state), {
        githubToken: access_token,
      });
    }

    return res.redirect(`${process.env.FRONTEND_URL}/profile/business`);
  } catch (err) {
    console.error('GitHub OAuth error:', err);
    res.status(500).send('GitHub auth failed');
  }
};

const listRepos = async (req, res) => {
  const { uid } = req.params;

  try {
    const businessSnap = await getDoc(doc(db, 'businesses', uid));
    const { githubToken } = businessSnap.data();
    if (!githubToken)
      return res.status(401).json({ error: 'GitHub not authorized' });

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    const repos = response.data.map((repo) => repo.full_name);
    res.json({ repos });
  } catch (err) {
    console.error('Error fetching repos:', err.message);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
};

const saveSelectedRepo = async (req, res) => {
  const { uid } = req.params;
  const { repo } = req.body;

  try {
    const businessSnap = await getDoc(doc(db, 'businesses', uid));
    const { githubToken } = businessSnap.data();
    if (!githubToken)
      return res.status(401).json({ error: 'GitHub not authorized' });

    await axios.get(`https://api.github.com/repos/${repo}`, {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    await updateDoc(doc(db, 'businesses', uid), { repo });
    res.json({ success: true });
  } catch (err) {
    console.error('Repo validation failed:', err.message);
    res.status(400).json({ error: 'Invalid repo or access denied' });
  }
};

module.exports = {
  initiateOAuth,
  handleCallback,
  listRepos,
  saveSelectedRepo,
};
