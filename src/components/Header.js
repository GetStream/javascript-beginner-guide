export default function Header({ messages, channel, client }) {
  // there are many useful properties on channel.state and the client object
  const otherMember = Object.keys(channel.state.members).filter(
    (user) => user !== client.userID
  );
  const to = otherMember.length ? otherMember : "Lobby";

  return (
    <div className="channel-header">
      <h1 className="to">{`To: ${to}`}</h1>
      <h2 className="extra-channel-data">
        {
          !messages.length && channel.data.name
            ? `This is the start of your 1:1 message history with ${to}`
            : channel.id === "lobby"
            ? "This is a 'Livestream' Channel Type. All 'roles' have read permissions by default"
            : channel.data.name
          // channel.data.name is the extra data we added to the 1:1 channel on
          // creation -> channel.watch() in User.js
        }
      </h2>
    </div>
  );
}
