import { useState } from "react";
import Login from "./components/Login";
import UserList from "./components/UserList";
import ChannelList from "./components/ChannelList";
import OneOnOne from "./components/OneOnOne";
import Lobby from "./components/Lobby";
import Navigation from "./components/Navigation";
import "./App.css";
import { ChatClientProvider } from "./ChatClientContext";

export default function App() {
  const [view, setView] = useState("login");
  const [channel, setChannel] = useState(null);

  return (
    <ChatClientProvider>
      <div className="App">
        {view === "login" ? (
          <Login setView={setView} />
        ) : view === "users" ? (
          <UserList setChannel={setChannel} setView={setView} />
        ) : view === "contacts" ? (
          <ChannelList setChannel={setChannel} setView={setView} />
        ) : view === "lobby" ? (
          <Lobby setChannel={setChannel} setView={setView} />
        ) : (
          <OneOnOne channel={channel} view={view} />
        )}
        <Navigation setView={setView} view={view} />
      </div>
    </ChatClientProvider>
  );
}
