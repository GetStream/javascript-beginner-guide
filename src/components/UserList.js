import { useState, useEffect, useContext } from "react";
import { List } from "react-content-loader";
import UserOrChannel from "./UserOrChannel";
import { ChatClientContext } from "../ChatClientContext";

export default function UserList({ setChannel, setView }) {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(10);
  const [renderLoadMore, setRenderLoadMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const chatClient = useContext(ChatClientContext);

  useEffect(() => {
    const getAllUsers = async () => {
      const filter = { id: { $ne: chatClient.userID } };
      // const filter = {
      //   $and: [
      //     { last_active: { $lt: "2021-05-07T20:51:54.347823Z" } },
      //     { id: { $ne: chatClient.userID } },
      //   ],
      // };

      const sort = { last_active: -1 };
      // const sort = [{ last_active: -1 }, { created_at: 1 }];
      // const sort = [{ created_at: -1 }, { last_active: -1 }];
      // const sort = { $eq: { last_active: -1 } };

      const options = { limit: 10 };
      let response;
      if (debouncedTerm === "") {
        //
        response = await chatClient.queryUsers(filter, sort, options);
      } else {
        //
        response = await chatClient.queryUsers({
          id: { $autocomplete: debouncedTerm },
        });
      }
      setUsers(response.users);
      // if (!response.length) setRenderGetMore(false);
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
    const filter = { id: { $ne: chatClient.userID } };
    // const filter = {
    //   $and: [
    //     { last_active: { $lt: "2021-05-07T20:51:54.347823Z" } },
    //     { id: { $ne: chatClient.userID } },
    //   ],
    // };

    const sort = { last_active: -1 };
    // const sort = [{ last_active: -1 }, { created_at: 1 }];
    // const sort = [{ created_at: -1 }, { last_active: -1 }];
    // const sort = { $or: [{ last_active: -1 }, { created_at: 1 }] };
    // const sort = { "$and": [ { "last_active": { "$ne": '' } }, { "last_active": -1 } ] };

    // offset can be used for pagination by skipping the first <offset> (10, then 20...) users
    //   and then return the next 10 users
    const options = { offset, limit: 10 };
    const response = await chatClient.queryUsers(filter, sort, options);
    setOffset(offset + 10);
    const len = response.users.length;
    if (len === 10) setUsers([...users, ...response.users]);
    if (users[len - 1]?.id !== response.users[len - 1]?.id)
      setUsers([...users, ...response.users]);
    else console.log(response, users);
    // setRenderLoadMore(false);
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
