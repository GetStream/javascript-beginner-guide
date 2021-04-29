import { useState, Fragment } from "react";
import axios from "axios";

export default function Login({ client, setView }) {
  const [userID, setUserID] = useState("");

  const handleUserIDSubmit = (e) => {
    e.preventDefault();
    axios
      // trigger a call to server which calls createToken(userID)
      .post("http://localhost:8080/token", { userID })
      // token exists on result.data
      // https://getstream.io/chat/docs/javascript/init_and_users/?language=javascript
      .then((res) => client.connectUser({ id: userID }, res.data))
      .then(() => setView("users"))
      .catch((err) => console.error("ERROR", err));
  };

  return (
    <Fragment>
      <form className="user-input" onSubmit={handleUserIDSubmit}>
        <label>Enter a UserID </label>
        <input
          autoFocus
          type="text"
          name="userID"
          value={userID}
          placeholder="UserID..."
          onChange={(e) => setUserID(e.target.value)}
        ></input>
      </form>
    </Fragment>
  );
}
