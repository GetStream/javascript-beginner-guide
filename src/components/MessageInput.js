import { useState, Fragment } from "react";

export default function MessageInput({ channel, client }) {
  const [message, setMessage] = useState("");

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    // there are many possible fields to include with channel.sendMessage()
    // we will simply send a text field
    // https://getstream.io/chat/docs/javascript/send_message/?language=javascript
    channel
      .sendMessage({ text: message })
      .then(() => setMessage(""))
      .catch((err) => console.error(err));
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmitMessage}>
        <input
          autoFocus
          value={message}
          type="text"
          className="message-input"
          onChange={(e) => setMessage(e.target.value)}
          // there are many useful properties on channel.state
          placeholder={`Message ${Object.keys(channel.state.members).filter(
            (user) => user !== client.userID
          )}`}
        />
      </form>
    </Fragment>
  );
}
