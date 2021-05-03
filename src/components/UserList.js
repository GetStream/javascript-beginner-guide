import { useState, useEffect, Fragment } from "react";
import { List } from "react-content-loader";
import User from "./User";

export default function UserList({ client, setView, setChannel }) {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      // return users with id 'Not Equal' ($ne) to me
      // https://getstream.io/chat/docs/javascript/query_syntax/?language=javascript
      const filter = { id: { $ne: client.userID } };
      // how to sort the response - optional
      const sort = { last_active: -1 };
      const options = { limit: 10 };
      // https://getstream.io/chat/docs/javascript/query_users/?language=javascript
      const response = await client.queryUsers(filter, sort, options);
      // add note options
      setUsers(response.users);
    };
    getUsers();
    setTimeout(() => setLoading(false), 500);
  }, [client]);

  let offset = 10;
  const handleGetMoreUsersClick = async () => {
    const filter = { id: { $ne: client.userID } };
    const sort = { last_active: -1 };
    // offset can be used for pagination
    const options = { offset: offset, limit: 10 };
    offset += 10;
    const response = await client.queryUsers(filter, sort, options);
    if (users.length === 10) setUsers([...users, ...response.users]);
    if (
      users[users.length - 1]?.id !==
      response.users[response.users.length - 1]?.id
    )
      setUsers([...users, ...response.users]);
  };

  return (
    <div className="User-list">
      <h1 className="welcome">{`Welcome ${client.userID}`}</h1>
      {loading ? (
        <List className="loading" />
      ) : (
        <ul>
          {users ? (
            <Fragment>
              <p className="select">Select a user to chat with</p>
              {users &&
                users.map((user) => (
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
              "It looks like you are the only user - Logout and Log back in as
              another user to view a list of users to choose from"
            </p>
          )}
          <button
            onClick={handleGetMoreUsersClick}
            className="lobby-logout-users"
          >
            Get More Users
          </button>
        </ul>
      )}
    </div>
  );
}
