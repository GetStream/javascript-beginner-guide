const StreamChat = require("stream-chat").StreamChat;
require("dotenv").config({ path: "server/.env" });

const appKey = process.env.REACT_APP_KEY;
const secret = process.env.REACT_APP_SECRET;
// ensure your appKey and secret are not resolving to undefined
console.log("key: ", appKey, "secret: ", secret);

const serverClient = StreamChat.getInstance(appKey, secret);
const userID = "Zachery";

// There is no need for createToken() or the passing token to connectUser() on server side
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
  await serverClient.connectUser({ id: userID })
  const response = await serverClient
    .queryChannels(filter)
    .then(() => console.log(response));
};

getChannels()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const createChannel = async () => {
  const channel = serverClient.channel("livestream", "lobby");
  await channel.create();
  return await channel.create();
};

// createChannel()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

const deleteMessage = async (messageId) => {
  return await serverClient.deleteMessage(messageId, true);

  // deleteMessage("c75a421e-ad25-40a5-b457-96a3bf4")
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));
};

// deleteMessage('some_message_id')
// .then((res) => console.log(res))
// .catch((err) => console.log(err));

const deleteChannel = async (channelID) => {
  // await serverClient
  //   .connectUser({ id: userID }, token)
  //   .catch((err) => console.log(err));
  const channel = serverClient.channel("messaging", channelID);
  await channel.watch().catch((err) => console.log(err));
  return await channel.delete().catch((err) => console.log(err));
};

// deleteChannel("some_channel_id")
// .then((res) => console.log(res))
// .catch((err) => console.log(err));
