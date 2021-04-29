import { useState, useRef, Fragment } from "react";

export default function MessageInput({ view, channel, client }) {
  const [message, setMessage] = useState("");
  // const messagesEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    channel
      .sendMessage({ text: message })
      .then(() => setMessage(""))
      // .then(() => scrollToBottom())
      .catch((err) => console.error(err));
  };

  return (
    <Fragment>
      {/* <div ref={messagesEndRef}></div> */}
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
