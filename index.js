const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const router = express.Router();
const { Telegraf } = require("telegraf");
const crypto = require("crypto");

if (fs.existsSync(".env")) {
  dotenv.config();
}

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const PORT = process.env.PORT || 5000;

const secret = process.env.WEBHOOK_SECRET;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function sendMessage(message, buttontext, buttonurl) {
  await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message, {
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: buttontext,
            url: buttonurl,
          },
        ],
      ],
    },
  });
}

router.post("/webhook", (req, res) => {
  const expectedSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) {
  } else if (signature !== expectedSignature) {
    return res.sendStatus(403);
  }
  let data = req.body;
  if (data.starred_at) {
    sendMessage(
      `<a href="${data.repository.html_url}"><b>\[${data.repository.full_name}\] New Star Added</b></a>\nStarred by: ${data.sender.login}\nTotal Stars: <code>${data.repository.stargazers_count}</code>`,
      "View Repository",
      data.repository.html_url
    );
  } else if (data.head_commit) {
    sendMessage(
      `<a href="${data.repository.html_url}"><b>\[${data.repository.name}:${
        data.ref.split("/")[2]
      }\] 1 new commit</b></a>\n<code>${data.after.substring(0, 7)}</code> ${
        data.head_commit.message
      } - ${data.head_commit.author.username}`,
      "View Commit",
      data.head_commit.url
    );
  } else if (data.forkee) {
    sendMessage(
      `<a href="${data.repository.html_url}/network/members><b>[${data.repository.full_name}] Fork Created: [${data.forkee.full_name}]</b></a>"`,
      "View Fork",
      data.forkee.html_url
    );
  } else if (data.action && data.issue) {
    if (
      data.action === "opened" ||
      data.action === "closed" ||
      data.action === "reopened" ||
      data.action === "locked" ||
      data.action === "unlocked"
    ) {
      sendMessage(
        `<a href="${data.issue.url}"><b>\[${
          data.repository.full_name
        }\] Issue ${data.action}: #${
          data.issue.number
        } ${data.issue.title.substring(0, 10)}...</b></a>\n${
          data.issue.user.login
        } - <code>${data.issue.body.substring(0, 120)}...</code>`,
        "View Issue",
        data.issue.html_url
      );
    }
  } else if (data.action && data.pull_request) {
    if (
      data.action === "opened" ||
      data.action === "closed" ||
      data.action === "locked" ||
      data.action === "unlocked" ||
      data.action === "reopened"
    ) {
      sendMessage(
        `<a href="${data.pull_request.html_url}"><b>[${
          data.repository.full_name
        }] Pull request ${data.action}: #${
          data.number
        } ${data.pull_request.title.substring(0, 10)}...</b></a>\n${
          data.pull_request.user.login
        } - <code>${data.pull_request.body.substring(0, 120)}...</code>`,
        "View Pull Request",
        `${data.pull_request.html_url}`
      );
    }
  } else if (data.action && data.release) {
    if (
      data.action === "published" ||
      data.action === "unpublished" ||
      data.action === "created" ||
      data.action === "edited" ||
      data.action === "deleted" ||
      data.action === "prereleased" ||
      data.action === "released"
    ) {
      sendMessage(
        `<a href="${data.release.html_url}"><b>[${data.repository.full_name}] New release ${data.action}: ${data.release.tag_name}</b></a>`,
        "View Release",
        data.release.html_url
      );
    }
  } else if (
    (data.action === "requested" && data.workflow_run) ||
    (data.action === "completed" && data.workflow_run)
  ) {
    sendMessage(
      `<a href="${data.workflow_run.html_url}"><b>[${data.repository.full_name}] Workflow ${data.action}: ${data.workflow.name}</b></a>`,
      "View Workflow",
      data.workflow_run.html_url
    );
  } else {
    console.log("Unknown event: ", data);
  }
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res
    .status(405)
    .send(
      "405 Method Not Allowed. Please see the README.md - https://github.com/agam778/github-to-telegram#readme"
    );
});

app.get("/webhook", (req, res) => {
  res
    .status(405)
    .send(
      "405 Method Not Allowed. Please see the README.md - https://github.com/agam778/github-to-telegram#readme"
    );
});

app.use("/", router);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server listening on port ${PORT}`);
});
