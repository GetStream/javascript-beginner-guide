// import { useState } from "react";

export default function User({ client, user, setView, setChannel }) {
  // const [channelName, setChannelName] = useState('');

  // const getChannelName = async (userID) => {
  //   const filter = { type: 'messaging', members: { $eq: [client.userID, userID] } }
  //   const response = await client.queryChannels(filter)
  //   setChannelName(response[0].id || `${client.userID}-${userID}`);

  //     // .then((res) => console.log(res[0].id, "channelName"));
  // }


  const handleUserClick = async (userID) => {
    // check if 1:1 channel exists
    // const filter = {
    //   type: "messaging",
    //   members: { $eq: [client.userID, userID] },
    // };
    // const response = await client.queryChannels(filter);
    // console.log(response[0]?.id, 'response', response);
    // const name = response[0]?.id || `${client.userID}-${userID}`;
    // setChannelName(name);
    // console.log(channelName, name, 'channelName');
    // let channel;
    // if (response) {
    // channel = client.channel('messaging', channelName);
    // } else {
    createNewChannel(userID);
    // }
    // console.log(channel, 'CHANNEL');
    // setChannel(channel);
    // setView(channelName);
    setView('');
  };

  const createNewChannel = async (userID) => {
    // console.log(userID, 'createNewChannel');
    // const channel = client.channel("messaging", channelName, {
      const channel = client.channel("messaging", `${client.userID}-${userID}`, {
      members: [client.userID, userID],
      name: `A private 1:1 channel between ${client.userID} & ${userID}`,
    });
    setChannel(channel);
    await channel.watch();
  }

  return (
    // <li className="User" onClick={() => getChannelName(user.id)}>

    <li className="User" onClick={() => handleUserClick(user.id)}>
      {user.id}
    </li>
  );
}
