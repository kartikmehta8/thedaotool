import React, { useEffect, useState } from "react";
import { Layout, Button, Space } from "antd";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Paymanai from "paymanai";
import toast from "../utils/toast";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("payman-user"));
  const role = localUser?.role;
  const uid = localUser?.uid;

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (role === "business" && uid) {
        const ref = doc(db, "businesses", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const { apiKey } = snap.data();
          if (!apiKey) {
            toast.warning("No Payman API key found. Add it in your profile.");
            return;
          }
          try {
            const payman = new Paymanai({ xPaymanAPISecret: apiKey });
            const usd = await payman.balances.getSpendableBalance("TSD");
            setBalance(usd);
          } catch (err) {
            console.error("Payman error:", err);
            toast.error("Error fetching Payman balance");
          }
        }
      }
    };
    fetchBalance();
  }, [uid, role]);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("payman-user");
    navigate("/login");
  };

  const handleProfile = () => {
    if (role === "business") {
      navigate("/profile/business");
    } else {
      navigate("/profile/contractor");
    }
  };

  return (
    <Header
      style={{
        backgroundColor: "#1f1f1f",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold" }}>
        Bizzy{" "}
        <span style={{ fontWeight: "normal", fontSize: "14px", color: "#aaa" }}>
          [{role}]
        </span>
      </div>
      <Space>
        {role === "business" && balance !== null && (
          <span style={{ color: "#3fefb4" }}>${balance.toFixed(2)}</span>
        )}
        <Button type="default" onClick={handleProfile}>
          Profile
        </Button>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default Navbar;
