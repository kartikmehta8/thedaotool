import React, { useEffect, useState } from "react";
import { Layout, Typography, Input, Button, Card, Form } from "antd";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "../../utils/toast";

const { Content } = Layout;
const { Title } = Typography;

const ContractorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("payman-user")) || {};
  const email = user.email;
  const uid = user.uid;

  const defaultFields = {
    name: "",
    roleTitle: "",
    skills: "",
    portfolio: "",
    linkedin: "",
    email: email,
  };

  const fetchProfile = async () => {
    try {
      const ref = doc(db, "contractors", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        form.setFieldsValue({ ...defaultFields, ...data });
      } else {
        form.setFieldsValue(defaultFields); // initial empty values.
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await setDoc(doc(db, "contractors", uid), {
        ...defaultFields,
        ...values,
        email,
      });
      toast.success("Profile updated");
    } catch (err) {
      console.log(err);
      toast.error("Error saving profile");
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          style={{ width: 500, backgroundColor: "#1f1f1f" }}
          loading={loading}
        >
          <Title level={3} style={{ color: "#fff", textAlign: "center" }}>
            Contractor Profile
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Full Name">
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input value={email} disabled style={{ color: "#ccc" }} />
            </Form.Item>
            <Form.Item name="roleTitle" label="Your Role / Title">
              <Input placeholder="Frontend Engineer, Designer, etc." />
            </Form.Item>
            <Form.Item name="skills" label="Skills (comma separated)">
              <Input placeholder="React, Figma, Node.js" />
            </Form.Item>
            <Form.Item name="portfolio" label="Portfolio URL or GitHub">
              <Input placeholder="https://yourportfolio.com" />
            </Form.Item>
            <Form.Item name="linkedin" label="LinkedIn Profile">
              <Input placeholder="https://linkedin.com/in/yourprofile" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default ContractorProfile;
