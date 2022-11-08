const fetch = require('node-fetch');
const core = require('@actions/core');

const issue_id = process.env.ISSUE_ID;
const issue_title = process.env.ISSUE_TITLE;
const issue_url = process.env.ISSUE_URL;
const issue_description = process.env.ISSUE_DESCRIPTION;
const apiKey = process.env.CLICKUP_API_KEY;
const listId = process.env.CLICKUP_LIST_ID;

(async () => {

  try {
    console.log(`Creating ClickUp task for issue: ${issue_id}`);

    if (!apiKey || !listId) {
      throw new Error('CLICKUP_API_KEY and CLICKUP_LIST_ID are required');
    }

    if (!issue_id || !issue_title || !issue_url || !issue_description) {
      throw new Error('ISSUE_ID, ISSUE_TITLE, ISSUE_URL, and ISSUE_DESCRIPTION are required');
    }

    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": `${issue_title} (#${issue_id})`,
        "description": `${issue_url}

${issue_description}      
`,
        "tags": ["github"],
        "status": "TODO",
        "priority": 3,
        "notify_all": false,
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
    console.log(e.message);
    core.error(`Error creating task ${issue_title}`);
  }
})();