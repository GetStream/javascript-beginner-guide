import { useState, useEffect, Fragment } from "react";
import User from "./User";
import { List } from "react-content-loader";

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
      // https://getstream.io/chat/docs/javascript/query_users/?language=javascript
      const response = await client.queryUsers(filter, sort);
      setUsers(response);
    };
    getUsers();
    setTimeout(() => setLoading(false), 500);
  }, [client]);

  return (
    <Fragment>
      <h1 className="welcome">{`Welcome ${client.userID}`}</h1>
      {loading ? (
        <List style={{ margin: "4rem" }} />
      ) : (
        <ul>
          {users ? (
            <Fragment>
              <p className="select">Select a user to chat with</p>
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
              "It looks like you are the only user - Logout and Log back in as
              another user to view a list of users to choose from"
            </p>
          )}
        </ul>
      )}
    </Fragment>
  );
}
