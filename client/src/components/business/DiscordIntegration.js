import React, { useEffect, useState } from 'react';
import { Button, Typography, Switch, Select, Space } from 'antd';
import {
  disconnectDiscord,
  fetchDiscordProfile,
  updateDiscordSettings,
  fetchDiscordChannels,
  saveDiscordChannel,
} from '../../api/firebaseBusiness';

const { Paragraph, Text } = Typography;
const { Option } = Select;

const DiscordIntegration = ({ user }) => {
  const [profile, setProfile] = useState({});
  const [channels, setChannels] = useState([]);
  const uid = user.uid;

  useEffect(() => {
    fetchDiscordProfile(uid, setProfile);
  }, [uid]);

  useEffect(() => {
    if (profile.discordAccessToken) {
      fetchDiscordChannels(uid).then(setChannels);
    }
  }, [profile.discordAccessToken, uid]);

  const handleIntegration = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/discord/oauth?userId=${uid}`;
  };

  const handleChannelSelect = (value) => {
    saveDiscordChannel(uid, value, setProfile);
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
              onChange={(checked) =>
                updateDiscordSettings(uid, profile, setProfile, {
                  discordEnabled: checked,
                })
              }
            />
          </Space>

          <Space>
            <Text style={{ color: '#fff' }}>Send:</Text>
            <Select
              value={profile.discordSendMode || 'own'}
              onChange={(val) =>
                updateDiscordSettings(uid, profile, setProfile, {
                  discordSendMode: val,
                })
              }
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
            onClick={() => disconnectDiscord(uid, profile, setProfile)}
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
