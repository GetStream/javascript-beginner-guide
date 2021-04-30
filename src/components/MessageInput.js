import { useState, Fragment } from "react";

export default function MessageInput({ channel, client }) {
  const [message, setMessage] = useState("");

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    message &&
      // there are many possible fields to include with channel.sendMessage()
      // we will simply send a text field
      // https://getstream.io/chat/docs/javascript/send_message/?language=javascript
      channel
        .sendMessage({ text: message })
        .then(() => setMessage(""))
        .catch((err) => console.error(err));
  };

  // console.log(getOtherMember({state: 'Z'}, {userID: 'B'}));

  const getOtherMember = () => {
    // there are many useful properties on channel.state and the client object
    const otherMember = Object.keys(channel.state.members).filter(
      (user) => user !== client.userID
    );
    return otherMember.length ? otherMember : "Lobby";
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
          placeholder={`Message ${getOtherMember(channel, client)}...`}
        />
      </form>
    </Fragment>
  );
}
