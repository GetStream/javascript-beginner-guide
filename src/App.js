import { useState } from "react";
import { StreamChat } from "stream-chat";
import Login from "./components/Login";
import UserList from "./components/UserList";
import ChannelList from "./components/ChannelList";
import OneOnOne from "./components/OneOnOne";
import Lobby from "./components/Lobby";
import "./App.css";

// the key (and secret) exist in the Dashboard
// Dashboard - https://getstream.io/accounts/login/
const appKey = process.env["REACT_APP_KEY"];

export default function App() {
  const [view, setView] = useState("login");
  const [channel, setChannel] = useState(null);
  // instantiate client on client-side with app key
  //   https://getstream.io/chat/docs/javascript/?language=javascript
  const chatClient = StreamChat.getInstance(appKey);

  const handleViewClick = async (room) => {
    setView(room);
    room === "login" && (await chatClient.disconnectUser());
  };

  return (
    <div className="App">
      {view === "login" ? (
        <Login chatClient={chatClient} setView={setView} />
      ) : view === "users" ? (
        <UserList
          chatClient={chatClient}
          setView={setView}
          setChannel={setChannel}
        />
      ) : view === "contacts" ? (
        <ChannelList
          chatClient={chatClient}
          setView={setView}
          setChannel={setChannel}
        />
      ) : view === "lobby" ? (
        <Lobby
          chatClient={chatClient}
          setView={setView}
          setChannel={setChannel}
        />
      ) : (
        <OneOnOne view={view} chatClient={chatClient} channel={channel} />
      )}
      {view !== "login" && (
        <div>
          <button
            onClick={() => handleViewClick("login")}
            className="lobby-logout-users"
          >
            Logout
          </button>
          {view !== "users" && (
            <button
              onClick={() => handleViewClick("users")}
              className="lobby-logout-users"
            >
              Search
            </button>
          )}
          {view !== "contacts" && (
            <button
              onClick={() => handleViewClick("contacts")}
              className="lobby-logout-users"
            >
              Contacts
            </button>
          )}
          {view !== "lobby" && (
            <button
              onClick={() => handleViewClick("lobby")}
              className="lobby-logout-users"
            >
              Lobby
            </button>
          )}
        </div>
      )}
    </div>
  );
}
