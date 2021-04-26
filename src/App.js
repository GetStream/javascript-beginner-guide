import { useState, useEffect, Fragment } from "react";
import Login from "./components/Login";
import UserList from './components/UserList';
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
        {view === 'users' ? (
          <Fragment>
            <h1>{`Welcome ${client.userID}`}</h1>
            <UserList client={client} />
          </Fragment>
        ) : (
          <Login client={client} setView={setView} />
        )}
      </header>
    </div>
  );
}

export default App;
