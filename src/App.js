import { useState } from "react";
import { StreamChat } from "stream-chat";
import Login from "./components/Login";
import UserList from "./components/UserList";
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
  // https://getstream.io/chat/docs/javascript/?language=javascript
  const client = StreamChat.getInstance(appKey);

  const handleViewClick = async (room) => {
    setView(room);
    room === "login" && (await client.disconnectUser());
  };

  return (
    <div className="App">
      {view === "login" ? (
        <Login client={client} setView={setView} />
      ) : view === "users" ? (
        <UserList client={client} setView={setView} setChannel={setChannel} />
      ) : view === "lobby" ? (
        <Lobby client={client} setView={setView} setChannel={setChannel} />
      ) : (
        <OneOnOne view={view} client={client} channel={channel} />
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
              Users
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
