import { useState, useEffect, Fragment } from "react";
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
      {users ? (
        <Fragment>
          <p>Select a user to chat with</p>
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
        </Fragment>
      ) : (
        <p className="instructions">
          "Looks like you are the only user - Logout and Log back in as another
          user to view a list of users"
        </p>
      )}
    </ul>
  );
}
