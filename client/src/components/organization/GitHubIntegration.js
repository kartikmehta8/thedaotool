import React, { useEffect, useState } from 'react';
import { Button, Typography, Space, Select, Spin } from 'antd';
import {
  disconnectGitHub,
  fetchGitHubRepos,
  saveGitHubRepo,
  handleAuth,
} from '../../api/organization/github';
import toast from '../../utils/toast';

const { Paragraph, Text } = Typography;
const { Option } = Select;

const GitHubIntegration = ({ uid, profile, setProfile }) => {
  const [repos, setRepos] = useState([]);
  const [selectingRepo, setSelectingRepo] = useState(false);
  useEffect(() => {
    const loadRepos = async () => {
      if (profile?.githubToken) {
        setSelectingRepo(true);
        const repoList = await fetchGitHubRepos(uid);
        setRepos(repoList);
        setSelectingRepo(false);
      } else {
        setRepos([]);
      }
    };
    loadRepos();
  }, [profile?.githubToken, uid]);

  const handleOAuth = async () => {
    const redirectUrl = await handleAuth(uid);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleRepoSelect = async (selectedRepo) => {
    const success = await saveGitHubRepo(uid, selectedRepo);
    if (success) {
      setProfile((prev) => ({ ...prev, repo: selectedRepo }));
      toast.success('GitHub repository saved successfully');
    }
  };

  const handleDisconnect = async () => {
    await disconnectGitHub(uid, profile);
    setRepos([]);
    setProfile((prev) => ({ ...prev, githubToken: '', repo: '' }));
  };

  return (
    <>
      <Paragraph style={{ color: '#fff', marginTop: '1rem' }}>
        Link a GitHub repo to sync issues labeled <code>dao</code> as bounties.
      </Paragraph>

      {profile.githubToken ? (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text style={{ color: '#52c41a' }}>
            GitHub Connected{profile.repo ? ` — ${profile.repo}` : ''}
          </Text>

          {selectingRepo ? (
            <Spin size="small" />
          ) : (
            <Select
              style={{ width: '100%' }}
              placeholder="Select repository"
              value={profile.repo || undefined}
              onChange={handleRepoSelect}
            >
              {repos.map((repo) => (
                <Option key={repo} value={repo}>
                  {repo}
                </Option>
              ))}
            </Select>
          )}

          <Button danger onClick={handleDisconnect} block>
            Disconnect GitHub
          </Button>
        </Space>
      ) : (
        <Button type="default" onClick={handleOAuth} block>
          Authorize GitHub
        </Button>
      )}
    </>
  );
};

export default GitHubIntegration;
