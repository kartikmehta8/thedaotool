import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { saveOrganizationProfile } from './profile';

export const fetchGitHubRepos = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/github/repos/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch GitHub repos');
  const data = await res.json();
  return data.repos || [];
};

export const saveGitHubRepo = async (uid, repo) => {
  const res = await fetchWithAuth(`${API_URL}/github/repo/${uid}`, {
    method: 'POST',
    body: JSON.stringify({ repo }),
  });
  if (!res.ok) throw new Error('Could not save GitHub repo');
  return true;
};

export const disconnectGitHub = async (uid, profile) => {
  await saveOrganizationProfile(
    uid,
    {
      ...profile,
      githubToken: '',
      repo: '',
    },
    profile.email
  );
  return true;
};

export const handleAuth = async (uid) => {
  const res = await fetch(`${API_URL}/github/auth?userId=${uid}`);
  if (!res.ok) throw new Error('Failed to initiate GitHub OAuth');
  const { redirectUrl } = await res.json();
  return redirectUrl;
};
