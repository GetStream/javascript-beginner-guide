import { useState, useEffect, useRef, Fragment } from "react";

export default function Lobby({ client, view, setChannel }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const channel = client.channel("livestream", "lobby");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const getMessagesAndWatchChannel = async () => {
      await channel.watch();
      setMessages(channel.state.messages);
      setTimeout(() => scrollToBottom(), 500);
    };
    getMessagesAndWatchChannel();
  }, [channel]);

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

  // listen to channel events for new messages in channel state
  // https://getstream.io/chat/docs/javascript/event_listening/?language=javascript
  channel.on("message.new", () => {
    setMessages(channel.state.messages);
    scrollToBottom();
  });

  function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let hour = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let amOrPm = 'AM';
    if (hour > 12) {
      amOrPm = 'PM'
      hour = (hour % 12).toString().padStart(2, "0");
    }
    // return month + "/" + day + "/" + year;
    return `${hour}:${minutes} ${amOrPm}`
  }

  return (
    <Fragment>
      <div className="channel-header">
        <h1 className="to">Lobby</h1>
        <h2 className="extra-channel-data">
          This is a Livestream Channel Type - every user has read and write
          permissions by default
        </h2>
      </div>
      <ul className="channel">
        {messages.map(
          (message) =>
            message.type !== "deleted" && (
              <Fragment key={message.id}>
                <li className="lobby">
                  {message.attachments.length ? (
                    <img
                      src={message.attachments[0].thumb_url}
                      alt={message.attachments[0].title}
                    />
                  ) : (
                    <Fragment>
                      <b>{`${message.user.id} `}</b>
                      {message.text}
                    </Fragment>
                  )}
                </li>
                <p className="lobby-time">
                  {getFormattedDate(message.created_at)}
                </p>
              </Fragment>
            )
        )}
      </ul>
      <div ref={messagesEndRef}></div>
      <form onSubmit={handleSubmitMessage}>
        <input
          autoFocus
          value={message}
          type="text"
          className="message-input"
          onChange={(e) => setMessage(e.target.value)}
          // there are many useful properties on channel.state
          placeholder="Message everyone..."
        />
      </form>
    </Fragment>
  );
}
