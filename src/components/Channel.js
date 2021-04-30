import { useState, useEffect, useRef, Fragment } from "react";
import Header from "./Header";
import MessageInput from "./MessageInput";

export default function Channel({ client, view, channel }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(channel.state.messages);
    setTimeout(() => scrollToBottom(), 500);
  }, [channel.state.messages]);
  // listen to channel events for new messages in channel state
  // https://getstream.io/chat/docs/javascript/event_listening/?language=javascript
  channel.on("message.new", () => {
    setMessages(channel.state.messages);
    scrollToBottom();
  });

  const getClassNames = (message) => {
    let classNames = "";
    classNames += message.user.id === client.userID ? "me" : "not-me";
    // the API will recognize slash commands or the first URL in a message text and enrich the
    // message object with attachments
    // https://getstream.io/chat/docs/javascript/message_format/?language=javascript
    classNames += message.attachments.length ? "-thumbnail" : "-text-message";
    return classNames;
  };

  const isMe = (message) => {
    return message.user.id === client.userID ? "me" : "not-me";
  };

  function getFormattedTime(date) {
    let hour = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let amOrPm = "AM";
    if (hour > 12) {
      amOrPm = "PM";
      hour = (hour % 12).toString().padStart(2, "0");
    }
    return `${hour}:${minutes} ${amOrPm}`;
  }

  return (
    <Fragment>
      <Header client={client} channel={channel} messages={messages} />
      <ul className="channel">
        {messages.map(
          (message) =>
            message.type !== "deleted" && (
              <Fragment key={message.id}>
                <li className={`message ${getClassNames(message)}`}>
                  {message.attachments.length ? (
                    <img
                      src={message.attachments[0].thumb_url}
                      alt={message.attachments[0].title}
                    />
                  ) : (
                    message.text
                  )}
                </li>
                <p className={`${isMe(message)}-dm-time`}>{getFormattedTime(message.created_at)}</p>
              </Fragment>
            )
        )}
      </ul>
      <div ref={messagesEndRef}></div>
      <MessageInput view={view} channel={channel} client={client} />
    </Fragment>
  );
}
