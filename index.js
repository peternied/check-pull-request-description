const core = require("@actions/core");
const github = require("@actions/github");

function run() {
  const pullRequest = github.context.payload.pull_request;
  const replacedTextSections = core.getInput('replaced-text-sections', { required: true }).split('\n');
  const checklistItems = core.getInput('checklist-items', { required: true }).split('\n');


  if (pullRequest) {
    const body = pullRequest.body;

    const errorMessages = checkForErrors(body, replacedTextSections, checklistItems);
    if (errorMessages.length != 0) {
      core.setFailed(`Found ${errorMessages.length} errors:\n` + errorMessages.map(msg => '   - ' + msg).join('\n'));
    }
  }
}

function checkForErrors(body, replacedTextSections, checklistItems) {
  const errorMessages = [];

  if (replacedTextSections) {
    for (let i = 0; i < replacedTextSections.length; i++) {
      let errorMessage = textShouldBeReplaced(replacedTextSections[i]);
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
  }

  if (checklistItems) {
    for (let i = 0; i < checklistItems.length; i++) {
      let errorMessage = checkForCheckListItem(checklistItems[i]);
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

function textShouldBeReplaced(body, item) {
  if (body && body.contains(item)) {
    return `Found instructive test that should be replaced.  \`${item}\``;
  }
  return null;
}

function checkForCheckListItem(body, item) {
  if (body && body.contains(item)) {
    return `Found check list item that should be checked \`[X]\` or the item should be 'struck out' with \`~\` characters on both sides of the text. \`${item}\``
  }
  return null;
}

run();
