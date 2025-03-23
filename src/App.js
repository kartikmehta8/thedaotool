import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Signup,
  Login,
  Dashboard,
  Landing,
  BusinessProfile,
  ContractorProfile,
} from "./pages";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ConfigProvider, theme } from "antd";

const App = () => {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("payman-user");
    return localUser ? JSON.parse(localUser) : null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);
          const role = snap.exists() ? snap.data().role : null;
          const fullUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role,
          };
          localStorage.setItem("payman-user", JSON.stringify(fullUser));
          setUser(fullUser);
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        localStorage.removeItem("payman-user");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          fontFamily: "Reddit Sans, sans-serif",
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/profile/business" element={<BusinessProfile />} />
          <Route path="/profile/contractor" element={<ContractorProfile />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
