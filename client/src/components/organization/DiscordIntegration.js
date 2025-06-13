import React, { useEffect, useState } from 'react';
import { Button, Typography, Switch, Select, Space } from 'antd';
import {
  disconnectDiscord,
  updateDiscordSettings,
  fetchDiscordChannels,
  saveDiscordChannel,
  fetchDiscordOAuthUrl,
} from '../../api/organization/discord';
import toast from '../../utils/toast';

const { Paragraph, Text } = Typography;
const { Option } = Select;

const DiscordIntegration = ({ uid, profile, setProfile }) => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const loadChannels = async () => {
      if (profile.discordAccessToken) {
        const ch = await fetchDiscordChannels(uid);
        setChannels(ch);
      }
    };
    loadChannels();
  }, [profile.discordAccessToken, uid]);

  const handleIntegration = async () => {
    const redirectUrl = await fetchDiscordOAuthUrl(uid);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleChannelSelect = async (value) => {
    try {
      await saveDiscordChannel(uid, value);
      setProfile((prev) => ({ ...prev, discordChannel: value }));
      toast.success('Discord channel saved successfully');
    } catch (err) {
      toast.error('Failed to save Discord channel');
    }
  };

  const handleSwitchChange = async (checked) => {
    try {
      await updateDiscordSettings(uid, { ...profile, discordEnabled: checked });
      setProfile((prev) => ({ ...prev, discordEnabled: checked }));
      toast.success(
        `Discord posting ${checked ? 'enabled' : 'disabled'} successfully`
      );
    } catch (err) {
      toast.error('Failed to update Discord settings');
    }
  };

  const handleSendModeChange = async (val) => {
    try {
      await updateDiscordSettings(uid, { ...profile, discordSendMode: val });
      setProfile((prev) => ({ ...prev, discordSendMode: val }));
      toast.success('Send mode updated successfully');
    } catch (err) {
      toast.error('Failed to update send mode');
    }
  };

  return (
    <>
      <Paragraph style={{ marginTop: '1rem' }}>
        Connect Discord to post new bounties automatically to your channel.
      </Paragraph>

      {profile.discordAccessToken ? (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text style={{ color: '#52c41a' }}>Discord connected</Text>

          <Space>
            <Text>Enable Posting:</Text>
            <Switch
              checked={profile.discordEnabled}
              onChange={handleSwitchChange}
            />
          </Space>

          <Space>
            <Text>Send:</Text>
            <Select
              value={profile.discordSendMode || 'own'}
              onChange={handleSendModeChange}
              style={{ width: 180 }}
            >
              <Option value="own">Only my bounties</Option>
              <Option value="all">All platform bounties</Option>
            </Select>
          </Space>

          <Space>
            <Text>Channel:</Text>
            <Select
              value={profile.discordChannel || undefined}
              onChange={handleChannelSelect}
              style={{ width: 220 }}
              placeholder="Select Discord Channel"
            >
              {channels.map((ch) => (
                <Option key={ch.id} value={ch.id}>
                  #{ch.name}
                </Option>
              ))}
            </Select>
          </Space>

          <Button
            danger
            onClick={async () => {
              await disconnectDiscord(uid, profile);
              setProfile({});
            }}
            block
          >
            Disconnect Discord
          </Button>
        </Space>
      ) : (
        <Button type="default" onClick={handleIntegration} block>
          Add to Discord
        </Button>
      )}
    </>
  );
};

export default DiscordIntegration;
