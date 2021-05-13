const express = require("express");
const StreamChat = require("stream-chat").StreamChat;
const cors = require("cors");
require("dotenv").config({ path: "server/.env" });
// key and secret exist in the Dashboard
// Dashboard - https://getstream.io/accounts/login/
const appKey = process.env.REACT_APP_KEY;
const secret = process.env.REACT_APP_SECRET;
if (!appKey || !secret) {
  throw new Error(
    "Expected STREAM_APP_KEY, STREAM_APP_SECRET env variables in a .env file (which is in .gitignore)"
  );
}
// initializing client on server-side requires a key & secret
// https://getstream.io/chat/docs/javascript/tokens_and_authentication/?language=javascript
const serverClient = StreamChat.getInstance(appKey, secret);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post("/token", async (req, res) => {
  const { userID } = req.body;
  // createToken() combines your app secret and userID to create token
  // because client-side client does not have secret, you must call server-side
  // createToken takes a second argument which sets an expiration time for the token
  const token = serverClient.createToken(
    userID,
    Math.floor(Date.now() / 1000) + 60 * 15
  );
  try {
    res.status(200).send(token);
  } catch (err) {
    res.status(500).send("Server Error: ", err);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
