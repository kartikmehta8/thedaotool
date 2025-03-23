import React, { useState } from "react";
import { Button, Input, Typography, Card, Layout } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import toast from "../../utils/toast";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log(result.user);
        const userProfile = {
          uid: result.user.uid,
          email: result.user.email,
          role: userSnap.data().role, // add more fields as needed.
        };

        localStorage.setItem("payman-user", JSON.stringify(userProfile));

        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error("User profile not found in database.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong during login");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#141414" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: 400,
            backgroundColor: "#1f1f1f",
            color: "#fff",
            marginTop: 100,
          }}
        >
          <Title level={3} style={{ color: "#fff", textAlign: "center" }}>
            Login
          </Title>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Button type="primary" block onClick={handleLogin}>
            Log In
          </Button>
          <Button
            type="link"
            block
            onClick={() => navigate("/signup")}
            style={{ marginTop: 10 }}
          >
            Don't have an account? Sign up
          </Button>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
