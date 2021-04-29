const StreamChat = require("stream-chat").StreamChat;
require("dotenv").config({ path: ".env" });

const apiKey = process.env.REACT_APP_API_KEY;
const zacheryToken = process.env.REACT_APP_ZACHERY_TOKEN;
const codyToken = process.env.REACT_APP_CODY_TOKEN;
const secret = process.env.REACT_APP_SECRET;
const userID = "Zachery";

const client = StreamChat.getInstance(apiKey, secret);

const getChannels = async () => {
  await client
    .connectUser({ id: 'Zachery' }, zacheryToken)
    .catch((error) => console.log("connect"));

  const filter = {
    type: 'livestream',
    // type: "messaging",
    // members: { $eq: ["Zachery", "Cody"] },
  };
  const response = await client.queryChannels(filter);
  console.log("response", response);
};

getChannels().then(() => {return})

// const sendMessage = async () => {
//   return await channel.sendMessage({
//     text: "@Zack Hello there from Steve",
//   });
// };

const createChannel = async () => {
  await client.connectUser({ id: "Zachery" }, zacheryToken);
  const channel = client.channel("livestream", "lobby");
  return await channel.create();
};

// createChannel()
//   .then(() => console.log('created'))
//   .catch((err) => console.log('Error', err));

const deleteMessage = async (messageId) => {
  await client.connectUser({ id: "Zachery" }, zacheryToken);
  return await client.deleteMessage(messageId, true);

  // deleteMessage("c75a421e-ad25-40a5-b457-96a3bf4c8a68")
  //   .then((res) => console.log("RESULT: ", res))
  //   .catch((err) => console.log("Error: ", err));
};

const deleteChannel = async (channelName) => {
  await client
    .connectUser({ id: userID }, codyToken)
    .catch((error) => console.log("connect"));
  const channel = client.channel("messaging", channelName);
  await channel.watch().catch((error) => console.log("watch"));
  return await channel.delete().catch((error) => console.log("delete", error));
};

// deleteChannel("!members-fnjmEdAjuz77kKRWoiI4628fCByF4E6ftvi21a2Ev9s").then(() => return 'Destroyed')
