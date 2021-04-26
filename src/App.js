import { useState, useEffect, Fragment } from "react";
import Login from "./components/Login";
import UserList from './components/UserList';
import Channel from "./components/Channel";
import { StreamChat } from "stream-chat";
import "./App.css";

const apiKey = process.env["REACT_APP_API_KEY"];

function App() {
  const client = StreamChat.getInstance(apiKey);

  // const [activeChannel, setActiveChannel] = useState("");
  const [view, setView] = useState('login');

  // useEffect(() => {
  //   setActiveChannel(client.connecting);
  // }, [client]);

  return (
    <div className="App">
      <header className="App-header">
        {view === "login" ? (
          <Login client={client} setView={setView} />
        ) : view === "users" ? (
          <Fragment>
            <h1>{`Welcome ${client.userID}`}</h1>
            <UserList client={client} setView={setView} />
          </Fragment>
        ) : (
          <Channel />
        )}
      </header>
    </div>
  );
}

export default App;
