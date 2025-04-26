const axios = require('axios');
const { db } = require('../../utils/firebase');
const { collection, getDocs, addDoc } = require('firebase/firestore');
const postToDiscord = require('../../utils/postToDiscord');

const syncGitHubIssues = async () => {
  const businesses = await getDocs(collection(db, 'businesses'));

  for (const b of businesses.docs) {
    const { githubToken, repo } = b.data();
    const businessId = b.id;

    if (!githubToken || !repo) continue;

    try {
      const issues = await axios.get(
        `https://api.github.com/repos/${repo}/issues`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
          },
          params: { labels: 'bizzy', state: 'open' },
        }
      );

      for (const issue of issues.data) {
        await addDoc(collection(db, 'contracts'), {
          name: issue.title,
          description: issue.body,
          githubIssueId: issue.id,
          deadline: '',
          businessId,
          issueLink: issue.html_url,
          status: 'open',
          createdAt: new Date().toISOString(),
          github: true,
          submittedLink: '',
          tags: issue.labels.map((l) => l.name),
        });

        // Replace label: bizzy → bizzy-platform.
        const updatedLabels = Array.from(
          new Set(
            issue.labels
              .filter((l) => l.name.toLowerCase() !== 'bizzy')
              .map((l) => l.name)
              .concat('bizzy-platform')
          )
        ).filter((l) => typeof l === 'string' && l.trim() !== '');

        await axios.patch(
          `https://api.github.com/repos/${repo}/issues/${issue.number}`,
          {
            labels: updatedLabels,
          },
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: 'application/vnd.github+json',
            },
          }
        );

        await postToDiscord({
          businessId,
          name: issue.title,
          description: issue.body,
          amount: ' TBD',
        });

        console.log(`Synced issue #${issue.number} from ${repo}`);
      }
    } catch (err) {
      console.error(`❌ Error syncing issues for ${repo}:`, err.message);
    }
  }
};

module.exports = syncGitHubIssues;
