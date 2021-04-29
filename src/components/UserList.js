import { useState, useEffect } from "react";
import User from "./User";

export default function UserList({ client, setView, setChannel }) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const filter = { id: { $ne: client.userID } };
      const sort = { last_message_at: 1 };
      const response = await client.queryUsers(filter, sort);
      setUsers(response);
    };
    getUsers();
  }, [client]);

  return (
    <ul>
      Select a user to chat with from this list of users
      {users &&
        users.users.map((user) => (
          <User
            key={user.created_at}
            client={client}
            user={user}
            setView={setView}
            setChannel={setChannel}
          />
        ))}
    </ul>
  );
}
