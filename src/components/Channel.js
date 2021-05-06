import Avatar from "./Avatar";

export default function User({ chatClient, channel, setView, setChannel }) {

  const handleUserClick = async (channelID) => {
    // chatClient.channel() instantiates a channel - channel type is the only mandatory argument
    // if no id is passed to chatClient.channel() (such as here), the id will be generated for you by the SDK
    // based on the channel type and channel members
    // this method does not call the Stream API
    // we will pass 2 members to this channel
    // the 'name' property is a custom field
    // https://getstream.io/chat/docs/javascript/creating_channels/?language=javascript

    const channel = chatClient.channel("messaging", channelID);
    // calling channel.watch() creates a channel, returns channel state, and tells the
    // server to send events to the chatClient when anything in the channel changes
    // on subsequent calls to watch() with this channel, the API will recognize that this channel already exists
    // and will not create a duplicate channel - nor will it update the 'members' or 'name' fields
    // https://getstream.io/chat/docs/javascript/watch_channel/?language=javascript
    await channel.watch();
    setChannel(channel);
    setView(channel.id);
  };

  return (
    <li className="User" onClick={() => handleUserClick(channel.id)}>
      <div className="user_info">
        <Avatar user={channel} />
        <div className="user_id">
          {channel.id}
          <div className="user_channel-info">
            {`Last message: ${channel.last_message_at|| channel.created_at}`}
          </div>
        </div>
        <div className="user_arrow">→</div>
      </div>
    </li>
  );
}
