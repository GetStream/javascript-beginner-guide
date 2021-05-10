import { useState, useEffect, useRef } from "react";
import { List } from "react-content-loader";
import Header from "./Header";
import MessageInput from "./MessageInput";

export default function Channel({ chatClient, view, channel }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(channel.state.messages);
    setLoading(false);
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Listen to channel events for new messages in channel state
  //   https://getstream.io/chat/docs/javascript/event_listening/?language=javascript
  channel.on("message.new", () => {
    setMessages(channel.state.messages);
    scrollToBottom();
  });

  const getClassNames = (message) => {
    let classNames = "";
    classNames += message.user.id === chatClient.userID ? "me" : "not-me";
    /** The API will recognize slash commands as well as enrich the message object with
          attachments for the first URL in a message text
            https://getstream.io/chat/docs/javascript/message_format/?language=javascript */
    classNames += message.attachments.length ? "-thumbnail" : "-text-message";
    return classNames;
  };

  const isMe = (message) => {
    return message.user.id === chatClient.userID ? "me" : "not-me";
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
    <>
      <Header chatClient={chatClient} channel={channel} messages={messages} />
      {loading ? (
        <List className="loading" />
      ) : (
        <ul className="channel">
          {messages.map(
            (message) =>
              message.type !== "deleted" && (
                <div key={message.id}>
                  <li className={`message ${getClassNames(message)}`}>
                    {/*
                      THIS COULD BE A GOOD PLACE TO TALK ABOUT THE MESSAGE OBJECT - 3 CORE OBJECT TYPES - USER, CHANNEL, AND MESSAGE
                    */}
                    {message.attachments.length ? (
                      <img
                        src={message.attachments[0].thumb_url}
                        alt={message.attachments[0].title}
                      />
                    ) : (
                      message.text
                    )}
                  </li>
                  <p className={`${isMe(message)}-dm-time`}>
                    {getFormattedTime(message.created_at)}
                  </p>
                </div>
              )
          )}
        </ul>
      )}
      <div ref={messagesEndRef}></div>
      <MessageInput view={view} channel={channel} chatClient={chatClient} />
    </>
  );
}
