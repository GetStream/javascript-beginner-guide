import { useState, useEffect, Fragment } from "react";
import { List } from "react-content-loader";
import User from "./User";

export default function UserList({ chatClient, setView, setChannel }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [renderGetMore, setRenderGetMore] = useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      const filter = { id: { $ne: chatClient.userID } };
      const sort = { last_active: -1 };
      const options = { limit: 10 };
      let response;
      if (debouncedTerm === "") {
        response = await chatClient.queryUsers(filter, sort, options);
      } else {
        response = await chatClient.queryUsers({
          id: { $autocomplete: debouncedTerm },
        });
      }
      setUsers(response.users);
      // if (!response.length) setRenderGetMore(false);
      setLoading(false);
    };
    getAllUsers();
  }, [debouncedTerm, chatClient]);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerID);
    };
  }, [searchTerm]);

  const handleGetMoreUsersClick = async () => {
    const filter = { id: { $ne: chatClient.userID } };
    const sort = { last_active: -1 };
    // offset can be used for pagination by skipping the first <offset> (10, then 20...) users
    //   and then return the next 10 users
    const options = { offset, limit: 10 };
    const response = await chatClient.queryUsers(filter, sort, options);
    setOffset(offset + 10);
    if (users.length === 10) setUsers([...users, ...response.users]);
    if (
      users[users.length - 1]?.id !==
      response.users[response.users.length - 1]?.id
    )
      setUsers([...users, ...response.users]);
    else setRenderGetMore(false);
  };

  return (
    <div className="User-list">
      <h1 className="user-list-contacts_header">{"People Search"}</h1>
      {loading ? (
        <List className="loading" />
      ) : (
        <Fragment>
          <input
            className="search_form"
            autoFocus
            type="text"
            name="searchTerm"
            value={searchTerm}
            placeholder="Search all users..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
          <p className='people'>Results</p>
            {users ? (
              users.map((user) => (
                <User
                  key={user.created_at}
                  chatClient={chatClient}
                  user={user}
                  setView={setView}
                  setChannel={setChannel}
                />
              ))
            ) : (
              <p className="instructions">
                "It looks like you are the only user - Logout and Log back in as
                another user to view a list of users to choose from"
              </p>
            )}
            {users.length % 10 === 0 && renderGetMore && (
              <button
                onClick={handleGetMoreUsersClick}
                className="lobby-logout-users"
              >
                Load more users
              </button>
            )}
          </ul>
        </Fragment>
      )}
    </div>
  );
}
