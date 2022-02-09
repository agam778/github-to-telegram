const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const router = express.Router();
const { Telegraf } = require("telegraf");

if (fs.existsSync(".env")) {
  dotenv.config();
}

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function sendMessage(message) {
  await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message, {
    parse_mode: "markdown",
    disable_web_page_preview: true,
  });
}

router.post("/webhook", (req, res) => {
  let data = req.body;
  if (data.starred_at) {
    sendMessage(
      `A New star has been added! ⭐\n\n
      - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
      - Starred by: [${data.sender.login}](${data.sender.html_url})\n
      - Stars Count: \`${data.repository.stargazers_count}\``
    );
  } else if (data.head_commit) {
    let commitdate = new Date(data.head_commit.timestamp);
    let commitdateformatted =
        commitdate.getDate() +
        "/" +
        (commitdate.getMonth() + 1) +
        "/" +
        commitdate.getFullYear(),
      commitmessage = data.head_commit.message;
    sendMessage(
      `A New commit has been pushed! 💥\n\n
      - Repository: [${data.repository.full_name}](${
        data.repository.html_url
      })\n
      - Commit Date: \`${commitdateformatted}\`\n
      - Commit Message: \`${commitmessage}\`\n
      - Commit Author: [${data.head_commit.author.name}](${
        data.head_commit.author.html_url
      })\n
      - Commit Branch: \`${data.ref.split("/")[2]}\`\n
      - Commit URL: [HERE](${data.head_commit.url})`
    );
  } else if (data.forkee) {
    sendMessage(
      `A New Fork has been created! 🍴\n\n
      - Forked Repository: [${data.forkee.full_name}](${data.forkee.repository.html_url})\n
      - Forked From: [${data.repository.full_name}](${data.repository.html_url})`
    );
  } else if (data.action && data.issue) {
    if (data.action === "opened") {
      sendMessage(
        `An issue has been opened! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Issue Title: \`${data.issue.title}\`\n
        - Issue Author: [${data.issue.user.login}](${data.issue.user.html_url})\n
        - Issue URL: [HERE](${data.issue.html_url})`
      );
    } else if (data.action === "closed") {
      sendMessage(
        `An issue has been closed! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Issue Title: \`${data.issue.title}\`\n
        - Issue URL: [HERE](${data.issue.html_url})`
      );
    } else if (data.action === "reopened") {
      sendMessage(
        `An issue has been reopened! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Issue Title: \`${data.issue.title}\`\n
        - Issue URL: [HERE](${data.issue.html_url})`
      );
    } else if (data.action === "locked") {
      sendMessage(
        `An issue has been locked! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Issue Title: \`${data.issue.title}\`\n
        - Issue URL: [HERE](${data.issue.html_url})`
      );
    } else if (data.action === "unlocked") {
      sendMessage(
        `An issue has been unlocked! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Issue Title: \`${data.issue.title}\`\n
        - Issue URL: [HERE](${data.issue.html_url})`
      );
    }
  } else if (data.action && data.pull_request) {
    if (data.action === "opened") {
      sendMessage(
        `A pull request has been opened! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Pull Request Title: \`${data.pull_request.title}\`\n
        - Pull Request URL: [HERE](${data.pull_request.html_url})`
      );
    } else if (data.action === "closed") {
      sendMessage(
        `A pull request has been closed/merged! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Pull Request Title: \`${data.pull_request.title}\`\n
        - Pull Request URL: [HERE](${data.pull_request.html_url})`
      );
    } else if (data.action === "locked") {
      sendMessage(
        `A pull request has been locked! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Pull Request Title: \`${data.pull_request.title}\`\n
        - Pull Request URL: [HERE](${data.pull_request.html_url})`
      );
    } else if (data.action === "unlocked") {
      sendMessage(
        `A pull request has been unlocked! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Pull Request Title: \`${data.pull_request.title}\`\n
        - Pull Request URL: [HERE](${data.pull_request.html_url})`
      );
    } else if (data.action === "reopened") {
      sendMessage(
        `A pull request has been reopened! 🐛\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Pull Request Title: \`${data.pull_request.title}\`\n
        - Pull Request URL: [HERE](${data.pull_request.html_url})`
      );
    }
  } else if (data.action && data.release) {
    if (data.action === "published") {
      sendMessage(
        `A release has been published! 🎉\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Release Title: \`${data.release.name}\`\n
        - Release URL: [HERE](${data.release.html_url})`
      );
    } else if (data.action === "unpublished") {
      sendMessage(
        `A release has been unpublished! \n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Release Title: \`${data.release.name}\`\n
        - Release URL: [HERE](${data.release.html_url})`
      );
    } else if (data.action === "created") {
      sendMessage(
        `A release has been created! 🎉\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Release Title: \`${data.release.name}\`\n
        - Release URL: [HERE](${data.release.html_url})`
      );
    } else if (data.action === "edited") {
      sendMessage(
        `A release has been edited!\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Release Title: \`${data.release.name}\`\n
        - Release URL: [HERE](${data.release.html_url})`
      );
    } else if (data.action === "deleted") {
      sendMessage(
        `A release has been deleted!\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Release Title: \`${data.release.name}\`\n
        - Release URL: [HERE](${data.release.html_url})`
      );
    } else if (data.action === "prereleased") {
      sendMessage(
        `A release has been prereleased!\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Release Title: \`${data.release.name}\`\n
        - Release URL: [HERE](${data.release.html_url})`
      );
    } else if (data.action === "released") {
      sendMessage(
        `A release has been released!\n\n
        - Repository: [${data.repository.full_name}](${data.repository.html_url})\n
        - Release Title: \`${data.release.name}\`\n
        - Release URL: [HERE](${data.release.html_url})`
      );
    }
  }
  res.sendStatus(200);
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
