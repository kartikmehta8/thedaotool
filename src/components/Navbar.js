import React from "react";
import { Layout, Button, Space } from "antd";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = ({ email }) => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("payman-user"));
  const role = localUser?.role;

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
        Payman{" "}
        <span style={{ fontWeight: "normal", fontSize: "14px", color: "#aaa" }}>
          [{role}]
        </span>
      </div>
      <Space>
        <Button type="default" onClick={handleProfile}>
          Profile
        </Button>
        <span style={{ color: "#ccc" }}>{email}</span>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default Navbar;
