const fetch = require('node-fetch');
const core = require('@actions/core');

const issue_id = core.getInput('ISSUE_ID', { required: true });
const issue_title = core.getInput('ISSUE_TITLE', { required: true });
const issue_url = core.getInput('ISSUE_URL', { required: true });
const issue_description = core.getInput('ISSUE_DESCRIPTION', { required: true });
const apiKey = core.getInput('CLICKUP_API_KEY', { required: true });
const listId = core.getInput('CLICKUP_LIST_ID', { required: true });

(async () => {

  try {
    console.log(`Creating ClickUp task for issue: ${issue_id}`);

    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": issue_title,
        "description": `${issue_url}

${issue_description}      
`,
        "tags": ["github"],
        "status": "BACKLOG",
        "priority": 3,
        "notify_all": true,
        "parent": null,
        "links_to": null
      })
    });

    if (response.ok) {
      core.info(`Created task ${issue_title}`);
    } else {
      core.error(`Error creating task ${issue_title}`);
    }
  } catch (e) {
    core.error(`Error creating task ${issue_title}`);
  }
})();