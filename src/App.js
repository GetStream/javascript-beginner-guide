import { useState } from "react";
import Login from "./components/Login";
import UserList from "./components/UserList";
import Channel from "./components/Channel";
import { StreamChat } from "stream-chat";
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
      ) : (
        <Channel view={view} client={client} channel={channel} />
      )}
      {view !== "login" && (
        <button onClick={handleLogoutClick} className="logout">
          Logout
        </button>
      )}
    </div>
  );
}
