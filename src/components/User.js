import React from "react";

export default function User({ client, user, setView }) {
  const handleUserClick = async (userID) => {
    const channel = client.channel("messaging", `${client.userID}:${userID}`, {
      members: [client.User, userID],
      name: `A private 1:1 channel between ${client.userID} & ${userID}`,
    });
    await channel.watch();
    setView(`${client.userID}:${userID}`);
  };

  return (
    <li className="User" onClick={handleUserClick} key={user.created_at}>
      {user.id}
    </li>
  );
}
