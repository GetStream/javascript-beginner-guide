import { useState } from "react";
import { StreamChat } from "stream-chat";
import Login from "./components/Login";
import UserList from "./components/UserList";
import ChannelList from "./components/ChannelList";
import OneOnOne from "./components/OneOnOne";
import Lobby from "./components/Lobby";
import Navigation from "./components/Navigation";
import "./App.css";

// The key (and secret) exist in the Dashboard
// Dashboard - https://getstream.io/accounts/login/
const appKey = process.env["REACT_APP_KEY"];

export default function App() {
  const [view, setView] = useState("login");
  const [channel, setChannel] = useState(null);
  // Instantiate client on client-side with app key
  //   https://getstream.io/chat/docs/javascript/?language=javascript
  const chatClient = StreamChat.getInstance(appKey);

  return (
    <div className="App">
      {view === "login" ? (
        <Login chatClient={chatClient} setView={setView} />
      ) : view === "users" ? (
        <UserList
          chatClient={chatClient}
          setChannel={setChannel}
          setView={setView}
        />
      ) : view === "contacts" ? (
        <ChannelList
          chatClient={chatClient}
          setChannel={setChannel}
          setView={setView}
        />
      ) : view === "lobby" ? (
        <Lobby
          chatClient={chatClient}
          setChannel={setChannel}
          setView={setView}
        />
      ) : (
        <OneOnOne chatClient={chatClient} channel={channel} view={view} />
      )}
      <Navigation chatClient={chatClient} setView={setView} view={view} />
    </div>
  );
}
