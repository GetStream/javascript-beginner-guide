import { useState, Fragment } from "react";
import Login from "./components/Login";
import UserList from "./components/UserList";
import Channel from "./components/Channel";
import { StreamChat } from "stream-chat";
import "./App.css";

const apiKey = process.env["REACT_APP_API_KEY"];

function App() {
  const [view, setView] = useState("login");
  const [channel, setChannel] = useState(null);
  const client = StreamChat.getInstance(apiKey);

  const handleLogoutClick = async () => {
    await client.disconnectUser();
    setView("login");
  };

  return (
    <div className="App">
      {/* <header className="App-header"> */}
        {view === "login" ? (
          <Login client={client} setView={setView} />
        ) : view === "users" ? (
          <Fragment>
            <h1>{`Welcome ${client.userID}`}</h1>
            <UserList
              client={client}
              setView={setView}
              setChannel={setChannel}
            />
          </Fragment>
        ) : (
          <Channel view={view} client={client} channel={channel} />
        )}
        {view !== "login" && (
          <button onClick={handleLogoutClick} className='logout'>Logout</button>
        )}
      {/* </header> */}
    </div>
  );
}

export default App;
