import React from "react";

export default function User({ client, user, setView }) {
  const handleUserClick = async (userID) => {
    console.log(client, "client", client.userID, userID);
    const channel = client.channel("messaging", `${client.userID}-${userID}`, {
      members: [client.userID, userID],
      name: `A private 1:1 channel between ${client.userID} & ${userID}`,
    });
    await channel.watch();
    setView(`${client.userID}-${userID}`);
  };

  return (
    <li className="User" onClick={() => handleUserClick(user.id)}>
      {user.id}
    </li>
  );
}
