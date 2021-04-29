export default function User({ client, user, setView, setChannel }) {

  const getChannelName = async (userID) => {
    const filter = {
      type: "messaging",
      members: { $eq: [client.userID, userID] },
    };
    const response = await client.queryChannels(filter);
    return response[0]?.id;
  };

  const handleUserClick = async (userID) => {
    // check if 1:1 channel exists
    let channelName = await getChannelName(userID);

    if (channelName) {
      const channel = client.channel("messaging", channelName);
      await channel.watch();
      setChannel(channel);
      setView(channelName);
    } else {
      createNewChannel(userID, `${client.userID}-${userID}`);
    }
  };

  const createNewChannel = async (userID, name) => {
    const channel = client.channel("messaging", name, {
      members: [client.userID, userID],
      name: `A private 1:1 channel between ${client.userID} & ${userID}`,
    });
    await channel.watch();
    setChannel(channel);
    setView(name);
  };

  return (
    <li className="User" onClick={() => handleUserClick(user.id)}>
      {user.id}
    </li>
  );
}
