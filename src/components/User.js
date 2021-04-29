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

    // https://getstream.io/chat/docs/javascript/query_channels/?language=javascript
    const channels = await client.queryChannels(filter);
    // return the channel id if it exists - otherwise return undefined
    return channels[0]?.id;
  };

  const handleUserClick = async (userID) => {
    // check if a 1:1 channel exists already between you and the other user
    let channelID = await getChannelID(userID);
    // if a 1:1 channel exists already
    if (channelID) {
      // instantiates a channel to use - does not call API
      const channel = client.channel("messaging", channelID);
      // no need to call channel.watch() because queryChannels() watches all the channels
      // it returns
      setChannel(channel);
      setView('');
    // otherwise, we need to create a new channel
    } else {
      createNewChannel(userID, `${client.userID}-${userID}`);
    }
  };

  const createNewChannel = async (userID, id) => {
    // instantiate a channel to use, passing a new id and adding 2 members
    // the name property is custom extra data
    // https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript
    const channel = client.channel("messaging", id, {
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
