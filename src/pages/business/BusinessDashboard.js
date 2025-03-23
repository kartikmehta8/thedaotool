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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
import { db } from "../../firebase";
import toast from "../../utils/toast";

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
  const [selectedContract, setSelectedContract] = useState(null);
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem("payman-user")) || {};
  const uid = user.uid;

  const fetchContracts = async () => {
    try {
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
              contractorInfo = contractorSnap.data();
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

  const handleCreate = async (values) => {
    try {
      const newContract = {
        ...values,
        deadline: values.deadline.format("YYYY-MM-DD"),
        businessId: uid,
        contractorId: null,
        status: "open",
        submittedLink: "",
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, "contracts"), newContract);
      toast.success("Contract created");
      setModalVisible(false);
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
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Contract Modal */}
      <Modal
        title="Create New Contract"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        closeIcon={<span style={{ color: "#fff", fontSize: "16px" }}>×</span>}
      >
        <Form layout="vertical" onFinish={handleCreate} form={form}>
          <Form.Item name="name" label="Task Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount ($)"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
        </Form>
      </Modal>

      {/* View/Edit Contract Modal */}
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
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default BusinessDashboard;
