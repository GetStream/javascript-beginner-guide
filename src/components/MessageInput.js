import { useState, Fragment } from "react";

export default function MessageInput({ view, channel, client }) {
  const [message, setMessage] = useState("");

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    channel
      .sendMessage({ text: message })
      .then(() => setMessage(""))
      .catch((err) => console.error(err));
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmitMessage}>
        <input
          value={message}
          type="text"
          className="message-input"
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${Object.keys(channel.state.members).filter(
            (user) => user !== client.userID
          )}`}
        />
      </form>
    </Fragment>
  );
}
