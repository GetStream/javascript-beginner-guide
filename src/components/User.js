import Avatar from "./Avatar";
import { getOtherMember } from "../getOtherMember";

export default function User({
  chatClient,
  user,
  channel,
  setView,
  setChannel,
}) {
  const handleUserClick = async (userID) => {
    // chatClient.channel() instantiates a channel - channel type is the only mandatory argument
    // if no id is passed to chatClient.channel() (such as here), the id will be generated for you by the SDK
    // based on the channel type and channel members
    // this method does not call the Stream API
    // we will pass 2 members to this channel
    // the 'name' property is a custom field
    // https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript

    const channel = chatClient.channel("messaging", {
      members: [chatClient.userID, userID],
      name: `This is a 'Messaging' Channel Type. ${chatClient.userID} & ${userID} have role 'channel_member' which has read & write permissions by default`,
    });
    // calling channel.watch() creates a channel, returns channel state, and tells the
    // server to send events to the chatClient when anything in the channel changes
    // on subsequent calls to watch() with this channel, the API will recognize that this channel already exists
    // and will not create a duplicate channel - nor will it update the 'members' or 'name' fields
    // https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
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

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    let intervalType;

    if (interval >= 1) {
      intervalType = "year ago";
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = "month ago";
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = "day ago";
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = "hour ago";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = "minute ago";
            } else {
              interval = seconds;
              intervalType = "second ago";
            }
          }
        }
      }
    }

    if (interval > 1 || interval === 0) {
      intervalType += "s";
    }

    return interval + " " + intervalType;
  };

  let time;
  if (userOrChannel.last_active) {
    time = `Last active: ${timeSince(new Date(userOrChannel.last_active))}`;
  } else if (userOrChannel.created_at) {
    time = `Joined: ${timeSince(new Date(userOrChannel.created_at))}`;
  } else
    time = `Last message: ${userOrChannel.state.messages[
      userOrChannel.state.messages.length - 1
    ].text.slice(0, 40)}`;

  return (
    <li className="User" onClick={() => handleUserClick(name)}>
      <div className="user_info">
        <Avatar userOrChannel={userOrChannel} chatClient={chatClient} />
        <div className="user_id">
          {name}
          <div className="user_channel-info">{time}</div>
        </div>
        <div className="user_arrow">→</div>
      </div>
    </li>
  );
}
