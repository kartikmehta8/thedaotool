const { db } = require('../utils/firebase');
const {
  doc,
  updateDoc,
  query,
  collection,
  getDocs,
  getDoc,
  where,
  setDoc,
} = require('firebase/firestore');

exports.applyToContract = async (req, res) => {
  try {
    const { contractId, userId } = req.body;
    await updateDoc(doc(db, 'contracts', contractId), {
      status: 'assigned',
      contractorId: userId,
    });
    res.status(200).json({ message: 'Applied successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Application failed' });
  }
};

exports.submitWork = async (req, res) => {
  try {
    const { contractId, submittedLink } = req.body;
    await updateDoc(doc(db, 'contracts', contractId), {
      status: 'pending_payment',
      submittedLink,
    });
    res.status(200).json({ message: 'Work submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Submission failed' });
  }
};

exports.fetchContracts = async (req, res) => {
  try {
    const uid = req.params.uid;
    const q = query(
      collection(db, 'contracts'),
      where('status', '!=', 'closed')
    );
    const snap = await getDocs(q);

    const allContracts = await Promise.all(
      snap.docs.map(async (docRef) => {
        const data = docRef.data();
        const businessSnap = await getDoc(
          doc(db, 'businesses', data.businessId)
        );
        return {
          id: docRef.id,
          ...data,
          businessInfo: businessSnap.exists() ? businessSnap.data() : {},
        };
      })
    );

    const filtered = allContracts.filter(
      (c) => c.status === 'open' || c.contractorId === uid
    );

    res.status(200).json({ contracts: filtered });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const snap = await getDoc(doc(db, 'contractors', req.params.uid));
    if (snap.exists()) return res.json(snap.data());
    res.status(404).json({ message: 'Profile not found' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    await setDoc(doc(db, 'contractors', uid), req.body);
    res.status(200).json({ message: 'Profile saved' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving profile' });
  }
};
