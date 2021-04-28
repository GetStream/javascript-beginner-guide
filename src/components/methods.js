// import { StreamChat } from "stream-chat";
const StreamChat = require("stream-chat").StreamChat;
require("dotenv").config({ path: ".env" });

const apiKey = process.env.REACT_APP_API_KEY;
const zacheryToken = process.env.REACT_APP_ZACHERY_TOKEN;
// // const secret = process.env.REACT_APP_SECRET;
const userID = "Zachery";
// const channelName = "!members-_fyCsJ3J7Mc51W36qIE6HlC8zrpvIAq_DIJSkongGUY";

const client = StreamChat.getInstance(apiKey);

const getChannels = async () => {
  await client
    .connectUser({ id: userID }, zacheryToken)
    .catch((error) => console.log("connect"));

    const filter = {
        type: "messaging",
        members: { $eq: ['Zachery', 'Cody'] },
      };
      const response = await client.queryChannels(filter);
      console.log(response[0]?.id, "response", response);
    }

//     // console.log(channel);

//     const deleteChannel = async () => {
//       console.log(zacheryToken);
//       await client.connectUser({ id: userID }, zacheryToken).catch((error) => console.log('connect', error));
//       const channel = client.channel("messaging", channelName);
//       await channel.watch().catch((error) => console.log("watch"));;
//       const destroy = await channel
//         .delete()
//         .catch((error) => console.log("delete"));;
//       console.log(destroy, "DESTROY");
//     }

//     const test = async () => {
//       const response = await deleteChannel();
//       // const response = await getChannels();
//   console.log(response, 'response');
// };

// test();

// require("dotenv").config({ path: __dirname + "/.env" });
// const { createToken } = require("../../server-side/createToken");

// const StreamChat = require("stream-chat").StreamChat;
// const apiKey = process.env["API_KEY"];

// For client-side auth the client uses only the app_key
// const client = StreamChat.getInstance(apiKey);

// const userId = "Zachery";
// const extraData = {
//   image: '',
// };

// Fetch token from client-side method to create token
// const token = createToken(userId);

// const connect = client.connectUser({ id: userId, extraData }, token);
// client.connectUser({ id: userID }, zacheryToken);

const cid = "!members-_fyCsJ3J7Mc51W36qIE6HlC8zrpvIAq_DIJSkongGUY";
// const channel = client.channel("messaging", cid);
// await channel.create();

// return await channel.watch();
// fetch the channel state, subscribe to future updates

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

// const deleteMessage = async (messageId) => {
//   await client.connectUser({ id: "adminUser" }, createToken("adminUser"));
//   return await client.deleteMessage(messageId);
// };

const deleteChannel = async () => {
  await client
    .connectUser({ id: userID }, zacheryToken)
    .catch((error) => console.log("connect"));
  const channel = client.channel("messaging", cid);
  await channel.watch().catch((error) => console.log("watch"));
  const destroy = await channel
    .delete()
    .catch((error) => console.log("delete"));
  console.log("DESTROY", destroy);
};

getChannels();

// deleteChannel();

// deleteMessage("75f0633b-8c87-4bae-9aa2-974ea0ac8f94")
//   .then((res) => console.log("RESULT: ", res))
//   .catch((err) => console.log("Error: ", err));
