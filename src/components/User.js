import { useState } from "react";

export default function User({ client, user, setView, setChannel }) {
  const [channelName, setChannelName] = useState(null);

  // const getChannelName = async (userID) => {
  //   const filter = { type: 'messaging', members: { $eq: [client.userID, userID] } }
  //   const response = await client.queryChannels(filter)
  //   setChannelName(response[0].id || `${client.userID}-${userID}`);

  //     // .then((res) => console.log(res[0].id, "channelName"));
  // }


  const handleUserClick = async (userID) => {
    const filter = {
      type: "messaging",
      members: { $eq: [client.userID, userID] },
    };
    const response = await client.queryChannels(filter);
    setChannelName(response[0].id || `${client.userID}-${userID}`);

    const channel = client.channel("messaging", channelName, {
    // const channel = client.channel("messaging", `${client.userID}-${userID}`, {
      members: [client.userID, userID],
      name: `A private 1:1 channel between ${client.userID} & ${userID}`,
    });
    await channel.watch();
    setChannel(channel);
    setView(`${client.userID}-${userID}`);
  };

  return (
    // <li className="User" onClick={() => getChannelName(user.id)}>

    <li className="User" onClick={() => handleUserClick(user.id)}>
      {user.id}
    </li>
  );
}
