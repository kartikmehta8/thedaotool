import React, { useEffect, useState } from 'react';
import { Button, Typography, Switch, Select, Space } from 'antd';
import {
  disconnectDiscord,
  fetchDiscordProfile,
  updateDiscordSettings,
  fetchDiscordChannels,
  saveDiscordChannel,
} from '../../api/business/discord';
import toast from '../../utils/toast';

const { Paragraph, Text } = Typography;
const { Option } = Select;

const DiscordIntegration = ({ user }) => {
  const [profile, setProfile] = useState({});
  const [channels, setChannels] = useState([]);
  const uid = user.uid;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchDiscordProfile(uid);
        setProfile(data || {});
      } catch (err) {
        console.error('Failed to fetch Discord profile');
      }
    };
    loadProfile();
  }, [uid]);

  useEffect(() => {
    const loadChannels = async () => {
      if (profile.discordAccessToken) {
        const ch = await fetchDiscordChannels(uid);
        setChannels(ch);
      }
    };
    loadChannels();
  }, [profile.discordAccessToken, uid]);

  const handleIntegration = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/discord/oauth?userId=${uid}`;
  };

  const handleChannelSelect = async (value) => {
    try {
      await saveDiscordChannel(uid, value);
      setProfile((prev) => ({ ...prev, discordChannel: value }));
      toast.success('Discord channel saved successfully');
    } catch (err) {
      console.error('Failed to save Discord channel');
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
      console.error('Failed to update Discord settings');
    }
  };

  const handleSendModeChange = async (val) => {
    try {
      await updateDiscordSettings(uid, { ...profile, discordSendMode: val });
      setProfile((prev) => ({ ...prev, discordSendMode: val }));
      toast.success('Send mode updated successfully');
    } catch (err) {
      console.error('Failed to update send mode');
    }
  };

  return (
    <>
      <Paragraph style={{ color: '#fff', marginTop: '1rem' }}>
        Connect Discord to post new contracts automatically to your channel.
      </Paragraph>

      {profile.discordAccessToken ? (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text style={{ color: '#52c41a' }}>Discord connected</Text>

          <Space>
            <Text style={{ color: '#fff' }}>Enable Posting:</Text>
            <Switch
              checked={profile.discordEnabled}
              onChange={handleSwitchChange}
            />
          </Space>

          <Space>
            <Text style={{ color: '#fff' }}>Send:</Text>
            <Select
              value={profile.discordSendMode || 'own'}
              onChange={handleSendModeChange}
              style={{ width: 180 }}
            >
              <Option value="own">Only my contracts</Option>
              <Option value="all">All platform contracts</Option>
            </Select>
          </Space>

          <Space>
            <Text style={{ color: '#fff' }}>Channel:</Text>
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
