import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function User({ client, user, setView, setChannel }) {
  const [messages, setMessages] = useState(null);
  const [ID, setID] = useState("");

  // there are 4 built-in Channel Types. We will query messaging Type
  // https://getstream.io/chat/docs/javascript/channel_features/?language=javascript
  // permissions vary by many factors including Channel Type 'role' and 'channel_membership'
  // https://getstream.io/chat/docs/javascript/channel_permission_policies/?language=javascript
  // we will search messaging channels for a channel with only these 2 members: 'Equals' ($eq)
  // this use case will only return 1 channel, so we will leave the sort argument empty: {}
  // queryChannels() will only return channels that the user can read
  // be default, queryChannels() will start watching all channels it returns
  // https://getstream.io/chat/docs/javascript/query_channels/?language=javascript
  useEffect(() => {
    const filter = {
      type: "messaging",
      members: { $eq: [client.userID, user.id] },
    };
    const options = { limit: 1 };
    const getChannelIDAndMessages = async () => {
      await client.queryChannels(filter, {}, options).then((res) => {
        setMessages(res[0]?.state.messages);
        setID(res[0]?.id);
      });
    };
    getChannelIDAndMessages();
  }, [client, user.id]);

  const handleUserClick = async (userID) => {
    // check if a 1:1 channel exists already between you and the other user
    if (ID) {
      // client.channel() instantiates a channel - channel type is the only mandatory argument
      // if no id is passed to client.channel(), the id will be generated for you by the SDK
      // this method does not call Stream API
      const channel = client.channel("messaging", ID);
      // no need to call channel.watch() because queryChannels() watches all the channels it returns
      setChannel(channel);
      setView(ID);
      // if a channel id is not returned from getChannelIDAndMessages, we need to create a new channel
    } else {
      createNewChannel(userID, `${client.userID}-${userID}`);
    }
  };

  // const getChannelID = async (userID) => {
  //   // there are 4 built-in Channel Types. We will query messaging Type
  //   // https://getstream.io/chat/docs/javascript/channel_features/?language=javascript
  //   // permissions vary by many factors including Channel Type 'role' and 'channel_membership'
  //   // https://getstream.io/chat/docs/javascript/channel_permission_policies/?language=javascript
  //   const filter = {
  //     type: "messaging",
  //     // search messaging channels for a channel with only these 2 members: 'Equals' ($eq)
  //     members: { $eq: [client.userID, userID] },
  //   };

  //   // queryChannels() will only return channels that the user can read
  //   // be default, queryChannels() will start watching all channels it returns
  //   // https://getstream.io/chat/docs/javascript/query_channels/?language=javascript
  //   const channels = await client.queryChannels(filter);
  //   // return the channel id if it exists - otherwise return undefined
  //   console.log(channels);
  //   return channels[0]?.id;
  // };

  const createNewChannel = async (userID, channelID) => {
    // instantiate a channel to use, passing a new id and adding 2 members
    // the name property is custom extra data
    // https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript
    const channel = client.channel("messaging", channelID, {
      members: [client.userID, userID],
      name: `This is a 'Messaging' Channel Type. ${client.userID} & ${userID} have role 'channel_member' which has read & write permissions by default`,
    });
    // calling channel.watch() creates a channel, returns channel.state, and tells the
    // server to send events when anything in the channel changes
    // https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
    await channel.watch();
    setChannel(channel);
    setView(channelID);
  };
  return (
    <li className="User" onClick={() => handleUserClick(user.id)}>
      <div className="user_info">
        <Avatar user={user} />
        <div className="user_id">
          {user.id}
          <div className="user_channel-info">
            {messages?.length
              ? `${messages[messages.length - 1].text.slice(0, 25)}...`
              : "No message history"}
          </div>
        </div>
        <div className="user_arrow">→</div>
      </div>
    </li>
  );
}
