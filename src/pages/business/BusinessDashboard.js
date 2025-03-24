import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  DatePicker,
  Form,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
  Select,
  List,
} from "antd";
import { PlusOutlined, MessageOutlined } from "@ant-design/icons";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { ref, onChildAdded, push, off } from "firebase/database";
import { db, rtdb } from "../../firebase";
import toast from "../../utils/toast";
import Paymanai from "paymanai";

const { Title, Text } = Typography;
const { Option } = Select;

const statusColors = {
  open: "green",
  assigned: "gold",
  pending_payment: "blue",
  closed: "red",
};

const BusinessDashboard = () => {
  const [contracts, setContracts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatContractId, setChatContractId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [form] = Form.useForm();
  const [apiKey, setApiKey] = useState("");

  const user = JSON.parse(localStorage.getItem("payman-user")) || {};
  const uid = user.uid;

  const fetchContracts = async () => {
    try {
      const businessSnap = await getDoc(doc(db, "businesses", uid));
      const key = businessSnap.data()?.apiKey;
      setApiKey(key);

      const q = query(
        collection(db, "contracts"),
        where("businessId", "==", uid)
      );
      const snapshot = await getDocs(q);
      const docs = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let contractorInfo = null;

          if (data.contractorId) {
            const contractorRef = doc(db, "contractors", data.contractorId);
            const contractorSnap = await getDoc(contractorRef);
            if (contractorSnap.exists()) {
              contractorInfo = {
                id: data.contractorId,
                ...contractorSnap.data(),
              };
            }
          }

          return {
            id: docSnap.id,
            ...data,
            contractorInfo,
          };
        })
      );
      setContracts(docs);
    } catch (err) {
      toast.error("Error fetching contracts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      const newContract = {
        name: values.name || "",
        description: values.description || "",
        deadline: values.deadline?.format("YYYY-MM-DD") || "",
        amount: Number(values.amount || 0),
        businessId: uid,
        contractorId: null,
        status: "open",
        submittedLink: "",
        createdAt: new Date().toISOString(),
        tags: values.tags ? values.tags.split(",") : [],
      };

      await addDoc(collection(db, "contracts"), newContract);
      toast.success("Contract created");
      setModalVisible(false);
      form.resetFields();
      fetchContracts();
    } catch (err) {
      toast.error("Failed to create contract");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contracts", id));
      toast.success("Contract deleted");
      setModalVisible(false);
      setViewModal(false);
      fetchContracts();
    } catch (err) {
      toast.error("Failed to delete contract");
    }
  };

  const handleSaveUpdate = async () => {
    try {
      await updateDoc(
        doc(db, "contracts", selectedContract.id),
        selectedContract
      );
      toast.success("Contract updated");
      setViewModal(false);
      fetchContracts();
    } catch (err) {
      toast.error("Error saving changes");
    }
  };

  const handlePayeeSetup = async () => {
    if (!selectedContract?.contractorInfo || !apiKey) return;
    try {
      const payman = new Paymanai({ xPaymanAPISecret: apiKey });
      const { name, email, accountNumber, routingNumber } =
        selectedContract.contractorInfo;

      const contractorRef = doc(
        db,
        "contractors",
        selectedContract.contractorId
      );
      const contractorSnap = await getDoc(contractorRef);

      if (contractorSnap.exists()) {
        const contractorData = contractorSnap.data();

        if (contractorData.payeeId) {
          toast.warning("Payee already exists for this contractor.");
          return;
        }

        const payee = await payman.payments.createPayee({
          type: "US_ACH",
          name,
          accountHolderName: name,
          accountHolderType: "individual",
          accountNumber,
          routingNumber,
          accountType: "checking",
          contactDetails: { email },
        });

        await updateDoc(contractorRef, { payeeId: payee.id });
        toast.success(`Payee created and saved for ${name}`);
      }
    } catch (err) {
      toast.error("Failed to create payee");
    }
  };

  const handleSendPayment = async () => {
    if (!selectedContract?.contractorInfo || !apiKey) return;
    try {
      const contractorSnap = await getDoc(
        doc(db, "contractors", selectedContract.contractorId)
      );

      if (!contractorSnap.exists()) {
        toast.error("Contractor profile not found");
        return;
      }

      const contractorData = contractorSnap.data();
      const payeeId = contractorData.payeeId;

      if (!payeeId) {
        toast.warning("No payee found. Please create payee first.");
        return;
      }

      const payman = new Paymanai({ xPaymanAPISecret: apiKey });
      await payman.payments.sendPayment({
        amountDecimal: Number(selectedContract.amount),
        payeeId,
        memo: `Payment for ${selectedContract.name}`,
        metadata: { contractId: selectedContract.id },
      });

      toast.success("Payment sent successfully");
    } catch (err) {
      toast.error("Failed to send payment");
    }
  };

  const handleChatOpen = (contractId) => {
    setChatContractId(contractId);
    setMessages([]);
    setChatModal(true);
    const chatRef = ref(rtdb, `chats/${contractId}`);
    onChildAdded(chatRef, (snapshot) => {
      const msg = snapshot.val();
      setMessages((prev) => [...prev, msg]);
    });
  };

  const handleSendMessage = async () => {
    console.log(newMessage);
    if (!newMessage.trim()) return;
    const chatRef = ref(rtdb, `chats/${chatContractId}`);
    await push(chatRef, {
      senderId: uid,
      senderName: "Business",
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    });
    setNewMessage("");
  };

  const handleChatClose = () => {
    if (chatContractId) {
      const chatRef = ref(rtdb, `chats/${chatContractId}`);
      off(chatRef);
    }
    setChatModal(false);
    setChatContractId(null);
    setMessages([]);
  };

  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={3} style={{ color: "#fff" }}>
        My Contracts
      </Title>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setModalVisible(true)}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Create Contract
      </Button>

      <Row gutter={[16, 16]}>
        {contracts.map((contract) => (
          <Col xs={24} sm={12} md={8} key={contract.id}>
            <Card
              hoverable
              style={{ backgroundColor: "#1f1f1f" }}
              onClick={() => {
                setSelectedContract({ ...contract });
                setViewModal(true);
              }}
              title={<Text strong>{contract.name}</Text>}
              extra={
                <Tag color={statusColors[contract.status]}>
                  {contract.status}
                </Tag>
              }
            >
              <p>
                <Tag color="blue">Deadline</Tag> {contract.deadline}
              </p>
              <p>
                <Tag color="purple">Amount</Tag> ${contract.amount}
              </p>
              <p>{contract.description}</p>
              <Button
                key="delete"
                danger
                onClick={() => {
                  handleDelete(contract.id);
                  setViewModal(false);
                }}
              >
                Delete
              </Button>{" "}
              <Button
                icon={<MessageOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChatOpen(contract.id);
                }}
              >
                Chat
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chat Modal */}
      <Modal
        open={chatModal}
        onCancel={handleChatClose}
        onOk={handleChatClose}
        title={`Chat with Contractor`}
        footer={null}
        width={600}
      >
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#111",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item>
                <strong>{item.senderName}:</strong> {item.text}
              </List.Item>
            )}
          />
        </div>
        <Input.Search
          placeholder="Type a message..."
          enterButton="Send"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSearch={handleSendMessage}
        />
      </Modal>

      <Modal
        title={selectedContract?.name}
        open={viewModal}
        onCancel={() => setViewModal(false)}
        onOk={handleSaveUpdate}
        okText="Save Changes"
      >
        {selectedContract && (
          <>
            <p>
              <strong>Description:</strong> {selectedContract.description}
            </p>
            <p>
              <strong>Deadline:</strong> {selectedContract.deadline}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedContract.amount}
            </p>
            <Divider />
            <p>
              <strong>Status:</strong>
            </p>
            <Select
              value={selectedContract.status}
              onChange={(val) =>
                setSelectedContract({ ...selectedContract, status: val })
              }
              style={{ width: "100%" }}
            >
              <Option value="open">Open</Option>
              <Option value="assigned">Assigned</Option>
              <Option value="pending_payment">Pending Payment</Option>
              <Option value="closed">Closed</Option>
            </Select>
            {selectedContract.contractorId && (
              <>
                <Divider />
                <p>
                  <strong>Submitted By:</strong>{" "}
                  {selectedContract.contractorInfo?.linkedin ? (
                    <a
                      href={selectedContract.contractorInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#69b1ff", fontWeight: "bold" }}
                    >
                      {selectedContract.contractorInfo.name || "View Profile"}
                    </a>
                  ) : (
                    selectedContract.contractorId
                  )}
                </p>
                <p>
                  <strong>Work Link:</strong>{" "}
                  {selectedContract.submittedLink || "Not submitted yet"}
                </p>
                <Divider />
                <Button
                  type="dashed"
                  onClick={handlePayeeSetup}
                  block
                  style={{ marginBottom: 10 }}
                >
                  Create Payee
                </Button>
                <Button type="primary" onClick={handleSendPayment} block>
                  Send Payment
                </Button>
              </>
            )}
          </>
        )}
      </Modal>

      <Modal
        title="Create New Contract"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        closeIcon={<span style={{ color: "#fff", fontSize: "16px" }}>×</span>}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: "Please enter Task Name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter Description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: "Please enter Deadline" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount ($)"
            rules={[{ required: true, message: "Please enter Amount ($)" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="tags"
            label="Tags (comma separated)"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" block onClick={handleCreate}>
            Create
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessDashboard;
