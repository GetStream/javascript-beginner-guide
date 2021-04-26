import { useState, useEffect, Fragment } from "react";
import MessageInput from "./MessageInput";

export default function Channel({ client, view, channel }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await channel.watch();
      setMessages(response.messages);
      channel.on("message.new", () => {
        setMessages(channel.state.messages);
      });
    };
    fetchMessages();
  }, [channel]);

  return (
    <Fragment>
      <ul>
        {messages && `This is the start of your 1:1 message history`}
        {messages.map((message) => (
          <li key={message.id} className="message">
            {message.text}
          </li>
        ))}
      </ul>
      <MessageInput view={view} channel={channel} />
    </Fragment>
  );
}
