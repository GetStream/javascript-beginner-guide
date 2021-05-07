import { useState, useEffect,useCallback, Fragment } from "react";
import { List } from "react-content-loader";
import User from "./User";

export default function UserList({ chatClient, setView, setChannel }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [renderGetMore, setRenderGetMore] = useState(true);

  // const getAllUsers = useCallback(
  //   async () => {
  //     // return users with id 'Not Equal' ($ne) to me
  //     // https://getstream.io/chat/docs/javascript/query_syntax/?language=javascript
  //     // sort users by last_active date - optional
  //     // limit the response to the 10 most recently active users
  //     // https://getstream.io/chat/docs/javascript/query_users/?language=javascript
  //     const filter = { id: { $ne: chatClient.userID } };
  //     const sort = { last_active: -1 };
  //     const options = { limit: 10 };
  //     const response = await chatClient.queryUsers(filter, sort, options);
  //     setUsers(response.users);
  //   }, [chatClient]
  //   )

  // const searchUsers = async (e) => {
  //   e.preventDefault();
  //   if (searchTerm === '') getAllUsers();
  //   else {
  //   const response = await chatClient.queryUsers({ id: { $autocomplete: searchTerm } });
  //   setUsers(response.users);
  //   }
  // }
  // setLoading(false)

  useEffect(() => {
    const getAllUsers = async () => {
      const filter = { id: { $ne: chatClient.userID } };
      const sort = { last_active: -1 };
      const options = { limit: 10 };
      let response;
      if (debouncedTerm === '') {
        response = await chatClient.queryUsers(filter, sort, options);
      } else {
        response = await chatClient.queryUsers({
          id: { $autocomplete: debouncedTerm },
        });
      }
      setUsers(response.users);
      setLoading(false);
    }
    getAllUsers();
  }, [debouncedTerm, chatClient])

  useEffect(() => {
    const timerID = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 1000);

    return () => {
      clearTimeout(timerID)
    }
  }, [searchTerm]);

  const handleGetMoreUsersClick = async () => {
    const filter = { id: { $ne: chatClient.userID } };
    const sort = { last_active: -1 };
    // offset can be used for pagination
    const options = { offset: offset, limit: 10 };
    setOffset(offset + 10);
    const response = await chatClient.queryUsers(filter, sort, options);
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
      <h1 className="welcome">{'People Search'}</h1>
      {loading ? (
        <List className="loading" />
      ) : (
        <ul>
          {users ? (
            <Fragment>
              <form>
                <input
                  className="search_form"
                  autoFocus
                  type="text"
                  name="searchTerm"
                  value={searchTerm}
                  placeholder="Search all users..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              <p className="select">Select a user to chat with</p>
              {users &&
                users.map((user) => (
                  <User
                    key={user.created_at}
                    chatClient={chatClient}
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
          {users.length % 10 === 0 && renderGetMore && (
            <button
              onClick={handleGetMoreUsersClick}
              className="lobby-logout-users"
            >
              Get More Users
            </button>
          )}
        </ul>
      )}
    </div>
  );
}
