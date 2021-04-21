import React, { useState, Fragment } from "react";
import axios from "axios";

export default function Login({ client, setIsLoggedIn }) {
  const [userID, setUserID] = useState("");

  const handleUserIDSubmit = (e) => {
    e.preventDefault();
    console.log(client, 'client');
    axios
      .post("http://localhost:8080/token", { userID })
      .then((res) => client.connectUser({ id: userID }, res.data))
      .then(() => setIsLoggedIn(true))
      .catch((err) => console.error("ERROR", err));
  };

  return (
    <Fragment>
      <form onSubmit={handleUserIDSubmit}>
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
