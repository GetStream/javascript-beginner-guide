import { useState } from "react";
import { ChatClientProvider } from "./ChatClientContext";
import ChannelList from "./components/ChannelList";
import Lobby from "./components/Lobby";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import OneOnOne from "./components/OneOnOne";
import UserList from "./components/UserList";
import "./App.css";

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
