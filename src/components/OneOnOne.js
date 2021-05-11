import { useState, useEffect, useRef } from "react";
import { List } from "react-content-loader";
import { getFormattedTime } from "../utils/getFormattedTime";
import { getClassNames } from "../utils/getClassNames";
import { isMe } from "../utils/isMe";
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
    setTimeout(() => {
      scrollToBottom();
      // console.log("hi");
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Listen to channel events for new messages in channel state
  //   https://getstream.io/chat/docs/javascript/event_listening/?language=javascript
  channel.on("message.new", () => {
    setMessages(channel.state.messages);
    scrollToBottom();
  });

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
                <li className={`message ${getClassNames(message, chatClient)}`}>
                  {message.attachments.length ? (
                    <img
                      src={message.attachments[0].thumb_url}
                      alt={message.attachments[0].title}
                    />
                  ) : (
                    message.text
                  )}
                </li>
                <p className={message.user.id === chatClient.userID ? "me-dm-time" : "not-me-dm-time"}>
                  {getFormattedTime(message.created_at)}
                </p>
              </div>
              )
          )}
          <div ref={messagesEndRef}></div>
        </ul>
      )}
      <MessageInput view={view} channel={channel} chatClient={chatClient} />
    </>
  );
}
