import React, { useState, Fragment } from "react";
import axios from "axios";

export default function Login({ client, setView }) {
  const [userID, setUserID] = useState("");

  const handleUserIDSubmit = (e) => {
    e.preventDefault();
    // console.log(client, 'client');
    axios
      .post("http://localhost:8080/token", { userID })
      // .then((response) => console.log(response))
      .then((res) => client.connectUser({ id: userID }, res.data))
      .then(() => setView('users'))
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
