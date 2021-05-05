const express = require("express");
const StreamChat = require("stream-chat").StreamChat;
const cors = require("cors");
require("dotenv").config({ path: 'server/.env' });
// key and secret exist in the Dashboard
// Dashboard - https://getstream.io/accounts/login/
const key = process.env.REACT_APP_KEY;
const secret = process.env.REACT_APP_SECRET;
// initializing client on server-side requires a key & secret
  // https://getstream.io/chat/docs/javascript/tokens_and_authentication/?language=javascript
const serverClient = StreamChat.getInstance(key, secret);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post("/token", async (req, res) => {
  const { userID } = req.body;
  // createToken() combines your app secret and userID to create token
  // because client-side client does not have secret, you must call server-side
  const token = serverClient.createToken(userID);
  try {
    res.status(200).send(token);
  } catch (err) {
    res.status(500).send("Server Error: ", err);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
