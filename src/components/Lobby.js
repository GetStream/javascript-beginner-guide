import { useState, useEffect, useRef, useContext } from "react";
import { ChatClientContext } from "../ChatClientContext";
import { List } from "react-content-loader";
import { getFormattedTime } from "../utils/getFormattedTime";
import { isImage } from "../utils/isImage";
import Header from "./Header";
import MessageInput from "./MessageInput";

export default function Lobby() {
  const chatClient = useContext(ChatClientContext);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // chatClient.channel() instantiates a channel - channel type is the only mandatory argument
  // If no id is passed, the id will be generated for you using the channel type and members- does not call API
  const channel = chatClient.channel("livestream", "lobby");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const setMessagesAndWatchChannel = async () => {
      // Calling channel.watch() allows you to listen for events when anything in the channel changes
      // https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
      await channel.watch();
      setMessages(channel.state.messages);
      setLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    };
    setMessagesAndWatchChannel();

    return () => {
      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to channel events for new messages in channel state
  // https://getstream.io/chat/docs/javascript/event_listening/?language=javascript
  channel.on("message.new", () => {
    setMessages(channel.state.messages);
    scrollToBottom();
  });

  return (
    <>
      <Header channel={channel} chatClient={chatClient} messages={messages} />
      {loading ? (
        <List className="loading" />
      ) : (
        <ul className="channel">
          {messages.map(
            (message) =>
              message.type !== "deleted" && (
                <div key={message.id}>
                  <li className={`lobby${isImage(message)}`}>
                    <b className="lobby-user">{`${message.user.id}`}: </b>
                    {message.attachments.length ? (
                      <img
                        src={message.attachments[0].thumb_url}
                        alt={message.attachments[0].title}
                      />
                    ) : (
                      message.text
                    )}
                  </li>
                  <p className="lobby-time">
                    {getFormattedTime(message.created_at)}
                  </p>
                </div>
              )
          )}
          <div className='ref' ref={messagesEndRef}></div>
        </ul>
      )}
      <MessageInput channel={channel} />
    </>
  );
}
