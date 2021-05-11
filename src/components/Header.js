import { useContext } from "react";
import { ChatClientContext } from "../ChatClientContext";
import { getOtherMember } from "../utils/getOtherMember";

export default function Header({ channel, messages }) {
  const chatClient = useContext(ChatClientContext);

  const to = getOtherMember(channel, chatClient);

  const headerText =
    !messages.length && channel.data.name
      ? `This is the start of your 1:1 message history with ${to}`
      : channel.id === "lobby"
      ? "This is a 'Livestream' Channel Type. All 'roles' have read permissions by default"
      : channel.id === chatClient.userID
      ? 'This is a "Messaging" Channel Type with no members. As the "owner", you have read/write permissions by default. No one else can read your messages here'
      : // channel.data.name is the custom field we added to the 1:1 channel on
        //   creation -> channel.watch() in User.js
        channel.data.name;

  return (
    <div className="channel-header">
      <h1 className="to">{`To: ${to}`}</h1>
      <h2 className="extra-channel-data">{headerText}</h2>
    </div>
  );
}
