const StreamChat = require("stream-chat").StreamChat;
require("dotenv").config({ path: "server/.env" });


const appKey = process.env.REACT_APP_KEY;
const secret = process.env.REACT_APP_SECRET;
const userID = "Zachery";
console.log(appKey, secret);
const client = StreamChat.getInstance(appKey, secret);

const token = client.createToken(userID);

const userArray = [
  { id: "Stephen" },
  { id: "Zach" },
  { id: "Cody" },
  { id: "Chantelle" },
  { id: "Suki" },
  { id: "Shweta" },
];

const upsertMany = async (users) => {
  return await client.upsertUsers(users);
};

// upsertMany(userArray);

const getChannels = async () => {
  // await client
  //   .connectUser({ id: userID }, token)
  //   .catch((err) => console.log(err));

  const filter = {
    type: "livestream",
    // type: "messaging",
    // members: { $eq: [userID, "Cody"] },
  };
  const response = await client
    .queryChannels(filter)
    .then(() => console.log(response));
};

getChannels()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const createChannel = async () => {
  // await client.connectUser({ id: userID }, token);
  const channel = client.channel("livestream", "lobby");
  return await channel.create();
};

// createChannel()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

const deleteMessage = async (messageId) => {
  // await client.connectUser({ id: userID }, token);
  return await client.deleteMessage(messageId, true);

  // deleteMessage("c75a421e-ad25-40a5-b457-96a3bf4")
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));
};

const deleteChannel = async (channelID) => {
  // await client
  //   .connectUser({ id: userID }, token)
  //   .catch((err) => console.log(err));
  const channel = client.channel("messaging", channelID);
  await channel.watch().catch((err) => console.log(err));
  return await channel.delete().catch((err) => console.log(err));
};

// deleteChannel("!members-fnjmEdAjuz77kKRWoiI4628fCByF4E6ftvi21a").then((res) => console.log(res))
