# GitHub To Telegram
Integrate your GitHub Repo events with Telegram Channel/Chat using GitHub Webhooks!

# Self Deploy
- Fork this repo
- Create a telegram bot at [@BotFather](https://t.me/botfather) (for getting the bot token)
- Make your bot admin in the channel/chat you are going to connect
- Add [@MissRose_Bot](https://t.me/MissRose_Bot), make it admin and run `/id` command (to get the id of chat/channel)
- Make a .env file/fill your environment variables like given in [`.env.sample`](./.env.sample)
- Install all dependencies - `yarn; yarn install`
- Run the bot - `yarn start`
- Now go to your GitHub Repo's settings and add a webhook to your repo, fill the Payload URL with `https://<your-domain>/webhook` and Content Type as `application/json`. Keep the secret blank as it hasn't been implemented yet.
- Then save your webhook and tada! You are ready to go.

Try Starring your repo/making a commit etc. and you will see the bot sending the message in the chat/channel!

Current events supported:
- `Stars`
- `Push`
- `Forks`
- `Pull Requests`
- `Issues`
- `Releases`

This project is in development and more things are being added!