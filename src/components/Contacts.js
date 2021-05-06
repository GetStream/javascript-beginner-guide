import { useState, useEffect, Fragment } from "react";
import { List } from "react-content-loader";
import User from "./User";

export default function UserList({ chatClient, setView, setChannel }) {
  const [loading, setLoading] = useState(true);
  const [channelList, setChannelList] = useState([]);
  const [offset, setOffset] = useState(10);
  const [renderGetMore, setRenderGetMore] = useState(true);

  useEffect(() => {
    const getChannels = async () => {
      // return messaging type channels the client is a member 'In' ($in)
      // https://getstream.io/chat/docs/javascript/query_syntax/?language=javascript
      // sort channels by last_message_at date - optional
      // limit the response to the 10 channels with recently sent messages
      // https://getstream.io/chat/docs/javascript/query_users/?language=javascript
      const filter = { type: 'messaging', members: {$in: [chatClient.userID] } };
      const sort = { last_message_at: -1 };
      const options = { limit: 10 };
      const response = await chatClient.queryChannels(filter, sort, options);
      console.log(response);
      setChannelList(response);
    };
    getChannels();
    setTimeout(() => setLoading(false), 500);
  }, [chatClient]);

  const handleGetMoreUsersClick = async () => {
    const filter = { type: 'messaging', members: {$in: [chatClient.userID] } };
    const sort = { last_message_at: -1 };
    // offset can be used for pagination
    const options = { offset: offset, limit: 10 };
    setOffset(offset + 10);
    const response = await chatClient.queryUsers(filter, sort, options);
    if (channelList.length === 10)
      setChannelList([...channelList, response]);
    if (
      channelList[channelList.length - 1]?.id !==
      response[response.length - 1]?.id
    )
      setChannelList([...channelList, response]);
    else setRenderGetMore(false);
  };

  return (
    <div className="User-list">
      <h1 className="welcome">{`Welcome ${chatClient.userID}`}</h1>
      {loading ? (
        <List className="loading" />
      ) : (
        <ul>
          {channelList ? (
            <Fragment>
              <p className="select">Select a contact to chat with</p>
              {channelList &&
                channelList.map((user) => (
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
              "It looks like you don't have any contacts, yet - go to Users and
              start a conversation with someone to view a list of contacts to
              choose from"
            </p>
          )}
          {channelList.length % 10 === 0 && renderGetMore && (
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
