const { db } = require('../utils/firebase');
const {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} = require('firebase/firestore');

exports.createContract = async (req, res) => {
  try {
    const { values, userId } = req.body;
    const contract = {
      name: values.name || '',
      description: values.description || '',
      deadline: values.deadline || '',
      amount: Number(values.amount || 0),
      businessId: userId,
      contractorId: null,
      status: 'open',
      submittedLink: '',
      createdAt: new Date().toISOString(),
      tags: values.tags ? values.tags.split(',') : [],
    };
    await addDoc(collection(db, 'contracts'), contract);
    res.status(200).json({ message: 'Contract created' });
  } catch (err) {
    res.status(500).json({ message: 'Creation failed' });
  }
};

exports.deleteContract = async (req, res) => {
  try {
    await deleteDoc(doc(db, 'contracts', req.params.id));
    res.status(200).json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Delete failed' });
  }
};

exports.updateContract = async (req, res) => {
  try {
    await updateDoc(doc(db, 'contracts', req.params.id), req.body);
    res.status(200).json({ message: 'Updated' });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.getContracts = async (req, res) => {
  try {
    const q = query(
      collection(db, 'contracts'),
      where('businessId', '==', req.params.uid)
    );
    const snapshot = await getDocs(q);
    const contracts = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      let contractorInfo = null;

      if (data.contractorId) {
        const contractorSnap = await getDoc(
          doc(db, 'contractors', data.contractorId)
        );
        if (contractorSnap.exists()) {
          contractorInfo = {
            id: data.contractorId,
            ...contractorSnap.data(),
          };
        }
      }

      contracts.push({ id: docSnap.id, ...data, contractorInfo });
    }

    res.status(200).json({ contracts });
  } catch {
    res.status(500).json({ message: 'Failed to fetch contracts' });
  }
};

exports.getContractor = async (req, res) => {
  try {
    const snap = await getDoc(doc(db, 'contractors', req.params.id));
    if (snap.exists()) return res.json(snap.data());
    res.status(404).json({ message: 'Not found' });
  } catch {
    res.status(500).json({ message: 'Error fetching contractor' });
  }
};

exports.updateContractor = async (req, res) => {
  try {
    await updateDoc(doc(db, 'contractors', req.params.id), req.body);
    res.status(200).json({ message: 'Contractor updated' });
  } catch {
    res.status(500).json({ message: 'Error updating contractor' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const snap = await getDoc(doc(db, 'businesses', req.params.uid));
    if (snap.exists()) return res.json(snap.data());
    res.status(404).json({ message: 'Profile not found' });
  } catch {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    await setDoc(doc(db, 'businesses', req.params.uid), req.body);
    res.status(200).json({ message: 'Profile saved' });
  } catch {
    res.status(500).json({ message: 'Error saving profile' });
  }
};
