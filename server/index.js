const express = require("express");
const StreamChat = require("stream-chat").StreamChat;
const cors = require("cors");
require("dotenv").config({ path: 'server/.env' });

const key = process.env.REACT_APP_API_KEY;
const secret = process.env.REACT_APP_SECRET;
const serverClient = StreamChat.getInstance(key, secret);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post("/token", async (req, res) => {
  const { userID } = req.body;
  const token = await serverClient.createToken(userID);
  try {
    res.status(200).send(token);
  } catch (err) {
    res.status(500).send("Server Error: ", err);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
