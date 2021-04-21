import { useState, useEffect } from "react";
import Login from "./components/Login";
import { StreamChat } from "stream-chat";
import "./App.css";

const apiKey = process.env["REACT_APP_API_KEY"];

function App() {
  const client = StreamChat.getInstance(apiKey);

  const [activeChannel, setActiveChannel] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setActiveChannel(client.connecting);
  }, [client]);

  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn ? (
          "Welcome"
        ) : (
          <Login client={client} setIsLoggedIn={setIsLoggedIn} />
        )}
      </header>
    </div>
  );
}

export default App;
