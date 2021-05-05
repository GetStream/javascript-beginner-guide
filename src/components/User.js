// import { useState } from "react";
import Avatar from "./Avatar";

export default function User({ client, user, setView, setChannel }) {
  // const [ID, setID] = useState("");

  // useEffect(() => {
  //   const filter = {
  //     type: "messaging",
  //     members: { $eq: [client.userID, user.id] },
  //   };
  //   const options = { limit: 1 };
  //   const getChannelIDAndMessages = async () => {
  //     await client.queryChannels(filter, {}, options).then((res) => {
  //       setMessages(res[0]?.state.messages);
  //       setID(res[0]?.id);
  //     });
  //   };
  //   getChannelIDAndMessages();
  // }, [client, user.id]);

  // const handleUserClick = async (userID) => {
  //   // // check if a 1:1 channel exists already between you and the other user
  //   // getChannelID(userID);

  //   // if (ID) {
  //   //   const channel = client.channel("messaging", ID);
  //   //   // no need to call channel.watch() because queryChannels() watches all the channels it returns
  //   //   setChannel(channel);
  //   //   setView(ID);
  //   //   // if a channel id is not returned from getChannelIDAndMessages, we need to create a new channel
  //   // } else {
  //     createNewChannel(userID);
  //   // }
  // };

  // const getChannelID = async (userID) => {
  //   // there are 4 built-in Channel Types. We will query channels with 'messaging' Type
  //   // https://getstream.io/chat/docs/javascript/channel_features/?language=javascript
  //   // queryChannels() will only return channels that the user can read
  //   // permissions vary by many factors including 'Channel Type', 'role', and 'channel_membership'
  //   // https://getstream.io/chat/docs/javascript/channel_permission_policies/?language=javascript
  //   // we will search messaging channels for a channel with only these 2 members: 'Equals' ($eq)
  //   // this use case will only return 1 channel, so we will leave the sort argument empty: {}
  //   // https://getstream.io/chat/docs/javascript/query_channels/?language=javascript
  //   // by default, queryChannels() will start watching all channels it returns
  //   console.log(client.userID, userID);
  //   const filter = {
  //     type: "messaging",
  //     members: { $eq: [client.userID, userID] },
  //   };

  //   await client.queryChannels(filter).then((res) => {
  //     setID(res[0]?.id);
  //     // channelID = res[0]?.id;
  //     console.log(res);
  //   });
  // };

  const handleUserClick = async (userID) => {
    // client.channel() instantiates a channel - channel type is the only mandatory argument
    // if no id is passed to client.channel() (such as here), the id will be generated for you by the SDK
    // this method does not call the Stream API
    // we will pass 2 members to this channel
    // the 'name' property is a custom field
      // https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript

      const channel = client.channel("messaging", {
        members: [client.userID, userID],
        name: `This is a 'Messaging' Channel Type. ${client.userID} & ${userID} have role 'channel_member' which has read & write permissions by default`,
      });
      // calling channel.watch() creates a channel, returns channel state, and tells the
        // server to send events to the client when anything in the channel changes
      // on subsequent calls to watch() with this channel, the API will recognize that this channel already exists
        // and will not create a duplicate channel - nor will it update the 'members' or 'name' fields
        // https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
    await channel.watch();
    setChannel(channel);
    setView(channel.id);
  };
  return (
    <li className="User" onClick={() => handleUserClick(user.id)}>
      <div className="user_info">
        <Avatar user={user} />
        <div className="user_id">
          {user.id}
          <div className="user_channel-info">
            {/* {messages?.length
              ? `${messages[messages.length - 1].text.slice(0, 25)}...`
              : "No message history"} */}
          </div>
        </div>
        <div className="user_arrow">→</div>
      </div>
    </li>
  );
}
