import { useState, useEffect, useContext } from "react";
import { ChatClientContext } from "../ChatClientContext";
import { List } from "react-content-loader";
import UserOrChannel from "./UserOrChannel";

export default function UserList({ setChannel, setView }) {
  const chatClient = useContext(ChatClientContext);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(10);
  const [renderLoadMore, setRenderLoadMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      /** Query for users with id that is 'Not Equal' ($ne) to client id 'And' ($and) a
            last_active value that is 'Greater Than' ($gt) a date that predates the app
            so the users that have not been active yet are not returned  */
      const filter = {
        $and: [
          { id: { $ne: chatClient.userID } },
          { last_active: { $gt: "2000-01-01T00:00:00.000000Z" } },
        ],
      };

      const sort = { last_active: -1 };
      const options = { limit: 10 };
      let response;

      if (debouncedTerm === "") {
        response = await chatClient.queryUsers(filter, sort, options);
        // search all users with id that match $autocomplete query
      } else {
        response = await chatClient.queryUsers({
          id: { $autocomplete: debouncedTerm },
        });
      }

      if (!response.users.length) setRenderLoadMore(false);
      else setUsers(response.users);
      setLoading(false);
    };

    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerID);
    };
  }, [searchTerm]);

  const handleGetMoreUsersClick = async () => {
    const filter = {
      $and: [
        { id: { $ne: chatClient.userID } },
        { last_active: { $gt: "2000-01-01T00:00:00.000000Z" } },
      ],
    };

    const sort = { last_active: -1 };
    // offset can be used for pagination by skipping the first <offset> (10, then 20...) users
    //   and then return the next 10 users
    const options = { offset, limit: 10 };

    const response = await chatClient.queryUsers(filter, sort, options);
    setOffset(offset + 10);
    const len = response.users.length;

    if (len === 10) setUsers([...users, ...response.users]);
    if (users[len - 1]?.id !== response.users[len - 1]?.id)
      setUsers([...users, ...response.users]);
    else setRenderLoadMore(false);
  };

  return (
    <div className="User-list">
      <h1 className="user-list-contacts_header">People Search</h1>
      {loading ? (
        <List className="loading" />
      ) : (
        <>
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
            <p className="people">Results</p>
            {users ? (
              users.map((user) => (
                <UserOrChannel
                  key={user.created_at}
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
            {users.length % 10 === 0 && renderLoadMore && (
              <button
                onClick={handleGetMoreUsersClick}
                className="lobby-logout-users"
              >
                Load more users
              </button>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
