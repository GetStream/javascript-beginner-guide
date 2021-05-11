import Avatar from "./Avatar";
import { getOtherMember } from "../utils/getOtherMember";
import { timeSince } from "../utils/timeSince";
import { ChatClientContext } from "../ChatClientContext";
import { useContext } from "react";

export default function User({ user, channel, setView, setChannel }) {
  const chatClient = useContext(ChatClientContext);
  const handleUserClick = async (userID) => {
    let channel;
    // chatClient.channel() instantiates a channel - channel type is the only mandatory argument
    // This method does not call the Stream API
    // If you select yourself, create a channel with an id as your userID with no members
    if (userID === chatClient.userID) {
      channel = chatClient.channel("messaging", userID);
    } else {
      /**
      If no id is passed to chatClient.channel(), the id will be generated for you by the SDK
        based on the channel type and channel members
      Pass 2 members to this channel
      The 'name' property is a custom field
        https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript
      */
      channel = chatClient.channel("messaging", {
        members: [chatClient.userID, userID],
        name: `This is a 'Messaging' Channel Type. ${chatClient.userID} & ${userID} have role 'channel_member' which has read & write permissions by default`,
      });
    }
    /**
    Calling channel.watch() creates a channel, returns channel state, and tells the
      server to send events to the chatClient when anything in the channel changes
        https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
    On subsequent calls to watch() with this channel, the API will recognize that this channel
      already exists and will not create a duplicate channel - nor will it update the 'members' or 'name' fields
        https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript
    */
    await channel.watch();
    setChannel(channel);
    setView(channel.id);
  };

  let userOrChannel = user || channel;

  let name = userOrChannel.id;
  if (userOrChannel.state) {
    const otherMember = getOtherMember(userOrChannel, chatClient);
    name = otherMember;
  }

  let info;
  if (userOrChannel.last_active) {
    info = `Last active ${timeSince(new Date(userOrChannel.last_active))}`;
  } else if (userOrChannel.created_at) {
    info = `Joined ${timeSince(new Date(userOrChannel.created_at))}`;
  } else if (userOrChannel.state.messages[0]) {
    info = `Last message: ${userOrChannel.state.messages[
      userOrChannel.state.messages.length - 1
    ].text.slice(0, 30)}...`;
  } else info = "No messages yet";

  return (
    <li className="User" onClick={() => handleUserClick(name)}>
      <div className="user_info">
        <Avatar userOrChannel={userOrChannel} chatClient={chatClient} />
        <div className="user_id">
          {name}
          <div className="user_channel-info">{info}</div>
        </div>
        <div className="user_arrow">→</div>
      </div>
    </li>
  );
}
