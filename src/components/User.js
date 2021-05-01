export default function User({ client, user, setView, setChannel }) {

  const getChannelID = async (userID) => {
    // there are 4 built-in Channel Types. We will query messaging Type
    // https://getstream.io/chat/docs/javascript/channel_features/?language=javascript
    // permissions vary by many factors including Channel Type 'role' and 'membership'
    // https://getstream.io/chat/docs/javascript/channel_permission_policies/?language=javascript
    const filter = {
      type: "messaging",
      // search messaging channels for a channel with only these 2 members: 'Equals' ($eq)
      members: { $eq: [client.userID, userID] },
    };

    // queryChannels() will only return channels that the user can read
    // be default, queryChannels() will start watching all channels it returns
    // https://getstream.io/chat/docs/javascript/query_channels/?language=javascript
    const channels = await client.queryChannels(filter);
    // return the channel id if it exists - otherwise return undefined
    return channels[0]?.id;
  };

  const handleUserClick = async (userID) => {
    // check if a 1:1 channel exists already between you and the other user
    let channelID = await getChannelID(userID);
    // if a channel exists already
    if (channelID) {
      // client.channel() instantiates a channel - channel type is the only mandatory argument
      // if no id is passed, the id will be generated for you - does not call API
      const channel = client.channel("messaging", channelID);
      // no need to call channel.watch() because queryChannels() watches all the channels it returns
      setChannel(channel);
      setView(channelID);
      // if a channel id is not returned from getChannelID, we need to create a new channel
    } else {
      createNewChannel(userID, `${client.userID}-${userID}`);
    }
  };

  const createNewChannel = async (userID, channelID) => {
    // instantiate a channel to use, passing a new id and adding 2 members
    // the name property is custom extra data
    // https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript
    const channel = client.channel("messaging", channelID, {
      members: [client.userID, userID],
      name: `A private 1:1 channel between ${client.userID} & ${userID}`,
    });
    // calling channel.watch() creates a channel, returns channel.state, and tells the
    // server to send events when anything in the channel changes
    // https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
    await channel.watch();
    setChannel(channel);
    setView("");
  };

  return (
    <li className="User" onClick={() => handleUserClick(user.id)}>
      {user.id}
    </li>
  );
}
