const StreamChat = require("stream-chat").StreamChat;
require("dotenv").config({ path: "server/.env" });

const appKey = process.env.REACT_APP_KEY;
const secret = process.env.REACT_APP_SECRET;
// ensure your appKey and secret are not resolving to undefined
console.log("KEY: ", appKey, "SECRET: ", secret);

const serverClient = StreamChat.getInstance(appKey, secret);
const userID = "Zachery";

// There is no need for createToken() or passing the token to connectUser() on server side
// 🙅 const token = serverClient.createToken(userID);
// ⛔️ client.connectUser({ id: userID }, token);

const upsertManyUsers = async () => {
  const userArray = [
    { id: "Stephen" },
    { id: "Zachery" },
    { id: "Cody" },
    { id: "Chantelle" },
    { id: "Suki" },
    { id: "Shweta" },
    { id: "Steve" },
    { id: "Zach" },
    { id: "Collin" },
    { id: "Chandler" },
    { id: "Sara" },
    { id: "Sharon" },
  ];
  return await serverClient
    .upsertUsers(userArray)
    .catch((err) =>
      console.log("An error occurred in server/methods.js - line 31", err)
    );
};
// Add mock users (optional) - From root directory - Run:
// npm run upsertUsers
// upsertUsers() is idempotent - if you call it multiple times with the same arguments, it will not affect your app state
// you may want to comment out the below invocation after initial successful call to avoid unexpected behavior
upsertManyUsers().then(() => console.log("Mock users added to app"));

// Below are additional helpful methods you may like to use

const getChannels = async () => {
  const filter = {
    type: "livestream",
    // type: "messaging",
    // members: { $eq: [userID, "Cody"] },
    // members: { $in: [userID] },
  };

  return await serverClient
    .queryChannels(filter)
    .catch((err) => console.log(err));
};

// getChannels()
//   .then((res) => console.log(res))

const createChannel = async () => {
  const channel = serverClient.channel("livestream", "lobby");
  return await channel.create()
    .catch((err) => console.log(err));
};

// createChannel()
//   .then((res) => console.log(res))

const deleteMessage = async (messageID) => {
  return await serverClient.deleteMessage(messageID, true)
    .catch((err) => console.log(err));
};

// deleteMessage('some_message_id')
// .then((res) => console.log(res))

const deleteChannel = async (channelID) => {
  const channel = serverClient.channel("messaging", channelID);
  // await channel.watch().catch((err) => console.log(err));
  return await channel.delete()
    .catch((err) => console.log(err));
};

// deleteChannel("some_channel_id")
//   .then((res) => console.log(res))
