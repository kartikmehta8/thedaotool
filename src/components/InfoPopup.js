import React, { useState } from "react";
import { Modal, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const InfoPopup = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 9999,
          backgroundColor: "#1677ff",
          color: "#fff",
          borderRadius: "8px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        <InfoCircleOutlined style={{ fontSize: "20px", marginRight: "8px" }} />
        About Bizzy Network
      </Button>

      <Modal
        title="Bizzy Network"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
      >
        <p>
          <strong>Bizzy Network</strong> is a full-stack, payman-based task
          marketplace designed to connect businesses with contractors
          seamlessly. It leverages Firebase, React, and PaymanAI’s payment SDKs
          to automate and streamline every step from contract creation to final
          payment.
        </p>

        <h4>Key Features:</h4>
        <ul>
          <li>
            Create & manage contracts with task details, deadlines, and budgets
          </li>
          <li>
            Assign contractors and track status: open, assigned,
            pending_payment, paid
          </li>
          <li>Payee creation + secure payments using PaymanAI SDK</li>
          <li>Real-time chat between business and contractor per contract</li>
          <li>Clean, dark-themed UI with role-based dashboards</li>
          <li>Manage profile details, tags, and skills</li>
        </ul>

        <h4>Payment Flow</h4>
        <p>
          Businesses create a payee profile for each contractor and can then
          send payments directly once work is submitted. All transactions are
          handled securely via the PaymanAI SDK.
        </p>

        <h4 style={{ marginTop: "2rem" }}>SWOT Analysis</h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
              marginTop: "1rem",
              color: "#fff",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#333" }}>
                <th>Strengths</th>
                <th>Opportunities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul>
                    <li>
                      Covers full contract lifecycle (create → assign → submit →
                      pay)
                    </li>
                    <li>
                      Seamless payee creation and direct payments via PaymanAI
                      SDK
                    </li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>
                      Leverage international payout rails as they roll out
                    </li>
                    <li>
                      Offer premium features like analytics, escrow, and
                      automation
                    </li>
                  </ul>
                </td>
              </tr>
              <tr style={{ backgroundColor: "#333" }}>
                <th>Weaknesses</th>
                <th>Threats</th>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Payee creation still requires business-side manual input
                    </li>
                    <li>
                      Lack of deep reporting, summaries, or dashboards (in development)
                    </li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>
                      Any PaymanAI API issues can impact critical payment
                      workflows
                    </li>
                    <li>
                      Competitors like Deel, Upwork, or Toptal offer similar
                      ecosystems
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default InfoPopup;
