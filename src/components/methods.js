// import { StreamChat } from "stream-chat";
const StreamChat = require("stream-chat").StreamChat;
require("dotenv").config({ path: ".env" });

const apiKey = process.env.REACT_APP_API_KEY;
const zacheryToken = process.env.REACT_APP_ZACHERY_TOKEN;
const codyToken = process.env.REACT_APP_CODY_TOKEN;
// // const secret = process.env.REACT_APP_SECRET;
const userID = "Zachery";

const client = StreamChat.getInstance(apiKey);

const getChannels = async () => {
  await client
    .connectUser({ id: userID }, zacheryToken)
    .catch((error) => console.log("connect"));

  const filter = {
    type: "messaging",
    members: { $eq: ["Zachery", "Cody"] },
  };
  const response = await client.queryChannels(filter);
  console.log(response[0]?.id, "response", response);
};

// const text = "@Zack Hello there from Steve";

// const sendMessage = async () => {
//   return await channel.sendMessage({
//     text: text,
//   });
// };

// const userID = "adminUser";

// const createChannel = async () => {
//   await client.connectUser({ id: userId }, token);

//   const channel = client.channel("messaging", "shopWare-01", {
//     members: ["adminUser", "Cody"],
//   });
//   await channel.create();
//   const message = await channel.sendMessage({
//     text: "hello there",
//   });

//   return message.message.id;
// };

const deleteMessage = async (messageId) => {
  await client.connectUser({ id: 'Zachery' }, zacheryToken);
  return await client.deleteMessage(messageId, true);
};

const deleteChannel = async (channelName) => {
  await client
    .connectUser({ id: userID }, codyToken)
    .catch((error) => console.log("connect"));
  const channel = client.channel("messaging", channelName);
  await channel.watch().catch((error) => console.log("watch"));
  return await channel.delete().catch((error) => console.log("delete", error));
};

// getChannels();

// deleteChannel("!members-fnjmEdAjuz77kKRWoiI4628fCByF4E6ftvi21a2Ev9s")
// return "Destroyed";

deleteMessage("c75a421e-ad25-40a5-b457-96a3bf4c8a68")
  .then((res) => console.log("RESULT: ", res))
  .catch((err) => console.log("Error: ", err));
