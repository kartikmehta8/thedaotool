const { db, rtdb } = require('../utils/firebase');
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
const { ref, remove } = require('firebase/database');
const triggerEmail = require('../utils/triggerEmail');

class ContractorController {
  async applyToContract(req, res) {
    try {
      const { contractId, userId } = req.body;
      await updateDoc(doc(db, 'contracts', contractId), {
        status: 'assigned',
        contractorId: userId,
      });

      await triggerEmail('contractAssignedToBusiness', contractId, {
        contractorId: userId,
      });

      res.status(200).json({ message: 'Applied successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Application failed' });
    }
  }

  async submitWork(req, res) {
    try {
      const { contractId, submittedLink } = req.body;
      await updateDoc(doc(db, 'contracts', contractId), {
        status: 'pending_payment',
        submittedLink,
      });

      await triggerEmail('submissionNotificationToBusiness', contractId, {
        submittedLink,
      });

      res.status(200).json({ message: 'Work submitted' });
    } catch (err) {
      res.status(500).json({ message: 'Submission failed' });
    }
  }

  async fetchContracts(req, res) {
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
  }

  async getProfile(req, res) {
    try {
      const snap = await getDoc(doc(db, 'contractors', req.params.uid));
      if (snap.exists()) return res.json(snap.data());
      res.status(404).json({ message: 'Profile not found' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  }

  async saveProfile(req, res) {
    try {
      const { uid } = req.params;
      await setDoc(doc(db, 'contractors', uid), req.body);
      res.status(200).json({ message: 'Profile saved' });
    } catch (err) {
      res.status(500).json({ message: 'Error saving profile' });
    }
  }

  async unassignSelf(req, res) {
    const { contractId } = req.body;

    if (!contractId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }

    try {
      const contractRef = doc(db, 'contracts', contractId);
      await updateDoc(contractRef, {
        contractorId: null,
        status: 'open',
        submittedLink: '',
      });

      const chatRef = ref(rtdb, `chats/${contractId}`);
      await remove(chatRef);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Unassign self failed:', err.message);
      return res.status(500).json({ error: 'Failed to unassign contractor' });
    }
  }

  async getContractorPayments(req, res) {
    const { uid } = req.params;

    try {
      const contractsRef = query(
        collection(db, 'contracts'),
        where('contractorId', '==', uid)
      );
      const contractSnapshots = await getDocs(contractsRef);

      const filteredContracts = contractSnapshots.docs.filter((docSnap) => {
        const data = docSnap.data();
        return ['closed', 'pending_payment'].includes(data.status);
      });

      const payments = await Promise.all(
        filteredContracts.map(async (docSnap) => {
          const data = docSnap.data();
          const businessId = data.businessId;

          let businessName = 'Unknown Business';

          if (businessId) {
            try {
              const businessSnap = await getDoc(
                doc(db, 'businesses', businessId)
              );
              if (businessSnap.exists()) {
                businessName = businessSnap.data().companyName || businessName;
              }
            } catch (err) {
              console.warn(
                `Failed to fetch business (${businessId})`,
                err.message
              );
            }
          }

          return {
            id: docSnap.id,
            businessName,
            contractTitle: data.name || 'Untitled',
            amount: data.amount || 0,
            date: data.updatedAt || data.createdAt || '',
            status: data.status === 'closed' ? 'Success' : 'Pending',
          };
        })
      );

      payments.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({ payments });
    } catch (err) {
      console.error('Error fetching contractor payments:', err.message);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  }
}

module.exports = new ContractorController();
