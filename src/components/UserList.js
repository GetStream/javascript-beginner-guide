import { useState, useEffect } from "react";
import User from "./User";

export default function UserList({ client }) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const filter = { id: { $ne: client.userID } };
      const response = await client.queryUsers(filter);
      setUsers(response);
      console.log("RESPONSE", response);
    };
    getUsers();
  }, [client]);

  return (
    <div>
      Select a user to chat with from this list of users
      <ul>
        {users &&
          users.users.map((user) => {
            return <User user={user} />;
          })}
      </ul>
    </div>
  );
}
