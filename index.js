const core = require("@actions/core");
const github = require("@actions/github");

function run() {
  const pullRequest = github.context.payload.pull_request;
  const checklistItems = core.getInput('checklist-items', { required: true }).split('\n');


  if (!pullRequest) {
    core.warning(`Unable to find associated pull request from the context: ${JSON.stringify(github.context)}`);
  }

  const body = pullRequest.body.split('\n');

  const errorMessages = checkForErrors(body, checklistItems);
  if (errorMessages.length != 0) {
    core.setFailed(`Found ${errorMessages.length} errors:\n` + errorMessages.map(msg => '   - ' + msg).join('\n'));
  }
}

function checkForErrors(body, replacedTextSections, checklistItems) {
  const errorMessages = [];

  if (checklistItems) {
    for (let i = 0; i < checklistItems.length; i++) {
      let errorMessage = checkForCheckListItem(body, checklistItems[i]);
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
  }

  if (!body) {
    errorMessages.push("The pull request description is empty. Please add a description.");
  }
  return errorMessages;
}

const completionInstructions = "Check list item that should be checked \`[x]\` or the item should be 'struck out' with \`~\` characters on both sides of the text."

function checkForCheckListItem(body, item) {
  for (let i = 0; i < body.length; i++) {
    const currentLine = body[i];
    if (currentLine.contains(item)) {
      if (hasCheckedItem(line, item)) {
        core.info(`Found completed checklist item ${item}`);
        return null;
      } else if (hasInactiveItem(line, item)) {
        core.info(`Found inactive checklist item ${item}`);
        return null;
      }
      const message = `${completionInstructions} Line \`${line}\``;
      core.error(message);
      return message;
    }
  }

  const message = `Unable to find check list item \`${item}\` in the pull request description. ${completionInstructions}`;
  core.error(message);
  return message;
}


function hasCheckedItem(line, checklistItem) {
  return line.contains(`[x] ${checklistItem}`) || line.contains(`[X] ${checklistItem}`);
}

function hasInactiveItem(line, checklistItem) {
  return line.contains(`~${checklistItem}~`);
}

run();
