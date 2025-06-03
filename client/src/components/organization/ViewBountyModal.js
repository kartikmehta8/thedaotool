import React from 'react';
import {
  Modal,
  Divider,
  Select,
  Button,
  InputNumber,
  Row,
  Col,
  Grid,
} from 'antd';
import {
  updateBounty,
  unassignContributor,
} from '../../api/organization/bounties';
import toast from '../../utils/toast';

const { Option } = Select;

const ViewBountyModal = ({
  visible,
  bounty,
  onCancel,
  onUpdateSuccess,
  setSelectedBounty,
}) => {
  const handleSaveUpdate = async () => {
    try {
      await updateBounty({
        ...bounty,
        deadline:
          bounty.deadline instanceof Date
            ? bounty.deadline.toISOString()
            : bounty.deadline?._seconds
              ? new Date(bounty.deadline._seconds * 1000).toISOString()
              : null,
      });
      toast.success('Bounty updated successfully');
      onUpdateSuccess();
      onCancel();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update bounty');
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignContributor(bounty.id);
      toast.success('Contributor unassigned and chat cleared');
      onUpdateSuccess();
    } catch {
      toast.error('Failed to unassign contributor');
    }
  };

  const screens = Grid.useBreakpoint();

  return (
    <Modal
      title="Edit Bounty"
      open={visible}
      onCancel={onCancel}
      onOk={handleSaveUpdate}
      okText="Save Changes"
      width={screens.xs ? '100%' : 600}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder="Bounty Name"
            value={bounty.name}
            onChange={(e) =>
              setSelectedBounty({ ...bounty, name: e.target.value })
            }
          />
        </Col>
        <Col span={24}>
          <Input.TextArea
            placeholder="Bounty Description"
            rows={4}
            value={bounty.description}
            onChange={(e) =>
              setSelectedBounty({ ...bounty, description: e.target.value })
            }
          />
        </Col>
        <Col span={24}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Deadline"
            value={
              bounty.deadline
                ? dayjs(
                    bounty.deadline._seconds
                      ? bounty.deadline._seconds * 1000
                      : bounty.deadline
                  )
                : null
            }
            onChange={(date) =>
              setSelectedBounty({
                ...bounty,
                deadline: date ? date.toDate() : null,
              })
            }
          />
        </Col>
        <Col span={12}>
          <InputNumber
            min={0}
            value={bounty.amount}
            onChange={(val) =>
              setSelectedBounty({ ...bounty, amount: Number(val) })
            }
            style={{ width: '100%' }}
            prefix="$"
            placeholder="Amount"
          />
        </Col>
        <Col span={12}>
          <Select
            value={bounty.status}
            onChange={(val) => setSelectedBounty({ ...bounty, status: val })}
            style={{ width: '100%' }}
          >
            <Option value="open">Open</Option>
            <Option value="assigned">Assigned</Option>
            <Option value="pending_payment">Pending Payment</Option>
            <Option value="closed">Closed</Option>
          </Select>
        </Col>
        <Col span={24}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Tags"
            value={bounty.tags || []}
            onChange={(tags) => setSelectedBounty({ ...bounty, tags })}
          />
        </Col>
        {bounty.github && bounty.issueLink && (
          <Col span={24}>
            <Input
              placeholder="Issue Link"
              value={bounty.issueLink}
              onChange={(e) =>
                setSelectedBounty({ ...bounty, issueLink: e.target.value })
              }
            />
          </Col>
        )}
        {bounty.submittedLink && (
          <Col span={24}>
            <Input
              placeholder="Submitted Work Link"
              value={bounty.submittedLink}
              onChange={(e) =>
                setSelectedBounty({ ...bounty, submittedLink: e.target.value })
              }
            />
          </Col>
        )}
        {bounty.contributorId && (
          <>
            <Col span={24}>
              <Divider />
              <p>
                <strong>Contributor:</strong>{' '}
                {bounty.contributorInfo?.linkedin ? (
                  <a
                    href={bounty.contributorInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#69b1ff', fontWeight: 'bold' }}
                  >
                    {bounty.contributorInfo.name || 'View Profile'}
                  </a>
                ) : (
                  <Tag>{bounty.contributorId}</Tag>
                )}
              </p>
              <Button danger onClick={handleUnassign} block>
                Unassign Contributor
              </Button>
            </Col>
          </>
        )}
      </Row>
    </Modal>
  );
};

export default ViewBountyModal;
