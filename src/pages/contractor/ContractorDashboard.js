import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Input,
  Row,
  Col,
  Tag,
  List,
} from "antd";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { onChildAdded, push, ref } from "firebase/database";
import { db, rtdb } from "../../firebase";
import toast from "../../utils/toast";

const { Title, Text } = Typography;

const statusColors = {
  open: "green",
  assigned: "gold",
  pending_payment: "blue",
  closed: "red",
};

const ContractorDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [submission, setSubmission] = useState("");
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("payman-user")) || {};
  const uid = user.uid;

  const fetchContracts = async () => {
    try {
      const q = query(
        collection(db, "contracts"),
        where("status", "!=", "closed")
      );
      const snap = await getDocs(q);
      const all = await Promise.all(
        snap.docs.map(async (docRef) => {
          const data = docRef.data();
          const businessSnap = await getDoc(
            doc(db, "businesses", data.businessId)
          );
          return {
            id: docRef.id,
            ...data,
            businessInfo: businessSnap.exists() ? businessSnap.data() : {},
          };
        })
      );
      const filtered = all.filter(
        (c) => c.status === "open" || c.contractorId === uid
      );
      setContracts(filtered);
    } catch (err) {
      toast.error("Failed to fetch contracts");
    }
  };

  const applyToContract = async (contractId) => {
    try {
      await updateDoc(doc(db, "contracts", contractId), {
        status: "assigned",
        contractorId: uid,
      });
      toast.success("Applied to contract");
      fetchContracts();
    } catch (err) {
      toast.error("Application failed");
    }
  };

  const submitWork = async () => {
    try {
      await updateDoc(doc(db, "contracts", selected.id), {
        status: "pending_payment",
        submittedLink: submission,
      });
      toast.success("Work submitted");
      setModalVisible(false);
      fetchContracts();
    } catch (err) {
      toast.error("Failed to submit");
    }
  };

  const openChat = (contract) => {
    setSelected(contract);
    setMessages([]);
    setChatModalVisible(true);
    const chatRef = ref(rtdb, `chats/${contract.id}`);
    onChildAdded(chatRef, (snapshot) => {
      setMessages((prev) => [...prev, snapshot.val()]);
    });
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msgRef = ref(rtdb, `chats/${selected.id}`);
    push(msgRef, {
      sender: uid,
      senderName: "Contractor",
      text: chatInput,
      timestamp: Date.now(),
    });
    setChatInput("");
  };

  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={3} style={{ color: "#fff" }}>
        Available Contracts
      </Title>
      <Row gutter={[16, 16]}>
        {contracts.map((c) => (
          <Col xs={24} sm={12} md={8} key={c.id}>
            <Card
              hoverable
              style={{ backgroundColor: "#1f1f1f" }}
              title={<Text strong>{c.name}</Text>}
              extra={<Tag color={statusColors[c.status]}>{c.status}</Tag>}
            >
              <p>
                <Tag color="cyan">Company</Tag>{" "}
                {c.businessInfo?.companyName || "Unknown"}
              </p>
              <p>
                <Tag color="blue">Deadline</Tag> {c.deadline}
              </p>
              <p>
                <Tag color="purple">Amount</Tag> ${c.amount}
              </p>
              <p>{c.description}</p>

              {Array.isArray(c.tags) && c.tags.length > 0 && (
                <div style={{ margin: "8px 0" }}>
                  {c.tags.map((tag) => (
                    <Tag key={tag} color="pink" style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}

              {c.status === "open" && (
                <Button
                  onClick={() => applyToContract(c.id)}
                  type="primary"
                  block
                >
                  Apply
                </Button>
              )}

              {c.contractorId === uid && (
                <>
                  {c.status === "assigned" && (
                    <Button
                      type="dashed"
                      block
                      onClick={() => {
                        setSelected(c);
                        setModalVisible(true);
                      }}
                      style={{ marginBottom: 8 }}
                    >
                      Submit Work
                    </Button>
                  )}

                  <Button type="default" block onClick={() => openChat(c)}>
                    Open Chat
                  </Button>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        open={modalVisible}
        title="Submit Work"
        onCancel={() => setModalVisible(false)}
        onOk={submitWork}
        okText="Submit"
      >
        <Input
          placeholder="Enter delivery link (GitHub, site, etc.)"
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
        />
      </Modal>

      <Modal
        open={chatModalVisible}
        title={`Chat with ${selected?.businessInfo?.companyName}`}
        onCancel={() => setChatModalVisible(false)}
        footer={null}
      >
        <List
          size="small"
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item>
              <strong>{msg.sender === uid ? "You" : "Them"}:</strong> {msg.text}
            </List.Item>
          )}
          style={{ maxHeight: 300, overflowY: "auto", marginBottom: 10 }}
        />
        <Input.TextArea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          rows={2}
          placeholder="Type your message..."
        />
        <Button
          onClick={sendMessage}
          type="primary"
          block
          style={{ marginTop: 8 }}
        >
          Send
        </Button>
      </Modal>
    </div>
  );
};

export default ContractorDashboard;
