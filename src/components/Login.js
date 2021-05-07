import { useState } from "react";
import axios from "axios";

export default function Login({ chatClient, setView }) {
  const [userID, setUserID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUserIDSubmit = (e) => {
    e.preventDefault();
    axios
      // trigger a call to server which calls createToken(userID)
      .post("http://localhost:8080/token", { userID })
      // token exists on result.data
      //   https://getstream.io/chat/docs/javascript/init_and_users/?language=javascript
      .then((res) => chatClient.connectUser({ id: userID }, res.data))
      .then(() => setView("lobby"))
      .catch((err) => {
        console.error(err);
        // use chatClient.disconnect() before trying to connect as a different user
        chatClient.disconnectUser();
        setErrorMessage(
          "user_details.id is not a valid user id. a-z, 0-9, @, _ and - are allowed."
        );
      });
  };

  return (
    <div className="Login">
      <header className="login_header">
        <h1 className="login_title">Stream Chat App</h1>
        <h2 className="login_infrastructure">Feature Rich and Scalable</h2>
      </header>
      <label className="login_label">UserID </label>
      <form className="login_form" onSubmit={handleUserIDSubmit}>
        <input
          className="login_input"
          autoFocus
          type="text"
          name="userID"
          value={userID}
          placeholder="Enter UserID..."
          onChange={(e) => {
            setUserID(e.target.value);
            setErrorMessage("");
          }}
        ></input>
        <p className="login_error">{errorMessage}</p>
        <button className="login_button">Login</button>
      </form>
    </div>
  );
}
