import { useState, useEffect, useRef, Fragment } from "react";
import { List } from "react-content-loader";
import MessageInput from "./MessageInput";
import Header from "./Header";

export default function Lobby({ chatClient }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  // chatClient.channel() instantiates a channel - channel type is the only mandatory argument
  // if no id is passed, the id will be generated for you using the channel type and members- does not call API
  const channel = chatClient.channel("livestream", "lobby");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const getMessagesAndWatchChannel = async () => {
      // calling channel.watch() allows you to listen for events when anything in the channel changes
        // https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
      await channel.watch();
      setMessages(channel.state.messages);
      setLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    };
    getMessagesAndWatchChannel();
  }, [channel]);

  // listen to channel events for new messages in channel state
    // https://getstream.io/chat/docs/javascript/event_listening/?language=javascript
  channel.on("message.new", () => {
    setMessages(channel.state.messages);
    scrollToBottom();
  });

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

  const isImage = (message) => {
    return message.attachments.length ? "-thumbnail" : "";
  };

  return (
    <Fragment>
      <Header channel={channel} chatClient={chatClient} messages={messages} />
      {loading ? (
        <List className='loading' />
      ) : (
        <ul className="channel">
          {messages.map(
            (message) =>
              message.type !== "deleted" && (
                <Fragment key={message.id}>
                  <li className={`lobby${isImage(message)}`}>
                    <b className="lobby-user">{`${message.user.id} `}</b>
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
                </Fragment>
              )
          )}
        </ul>
      )}
      <div ref={messagesEndRef}></div>
      <MessageInput channel={channel} chatClient={chatClient} />
    </Fragment>
  );
}
