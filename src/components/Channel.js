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
    const fetchMessages = async () => {
      const response = await channel.watch();
      setMessages(response.messages);
      channel.on("message.new", () => {
        setMessages(channel.state.messages);
        scrollToBottom();
      });
    };
    fetchMessages();
    scrollToBottom();
    console.log('hi');
  }, [channel]);

  const getClassNames = (message) => {
    let classNames = "";
    classNames += message.user.id === client.userID ? "me" : "not-me";
    classNames += message.attachments.length ? "-thumbnail" : "-text-message";
    return classNames;
  };

  return (
    <Fragment>
      <Header client={client} channel={channel} messages={messages} />
      <ul className="channel">
        {messages.map((message) => (
          <li key={message.id} className={`message ${getClassNames(message)}`}>
            {message.attachments.length ? (
              <img
                src={message.attachments[0].thumb_url}
                alt={message.attachments[0].title}
              />
            ) : (
              message.type === "regular" && message.text
            )}
          </li>
        ))}
      </ul>
      <div ref={messagesEndRef}></div>
      <MessageInput view={view} channel={channel} client={client} />
    </Fragment>
  );
}
