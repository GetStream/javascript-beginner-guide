import { useState } from "react";
import { StreamChat } from "stream-chat";
import Login from "./components/Login";
import UserList from "./components/UserList";
import Channel from "./components/Channel";
import Lobby from "./components/Lobby";
import "./App.css";

// the key (and secret) exist in the Dashboard
// Dashboard - https://getstream.io/accounts/login/
const appKey = process.env["REACT_APP_API_KEY"];

export default function App() {
  const [view, setView] = useState("login");
  const [channel, setChannel] = useState(null);
  // instantiate client on client-side with app key
  // https://getstream.io/chat/docs/javascript/?language=javascript
  const client = StreamChat.getInstance(appKey);

  const handleLogoutClick = async () => {
    await client.disconnectUser();
    setView("login");
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
        <Channel view={view} client={client} channel={channel} />
      )}
      {(!view || view === "lobby") && (
        <div>
          <button onClick={handleLogoutClick} className="logoutOrDM">
            Logout
          </button>
          <button onClick={() => setView("users")} className="logoutOrDM">
            Direct Message a user
          </button>
        </div>
      )}
    </div>
  );
}
