export default function Header({ messages, channel, client }) {
  const getOtherMember = () => {
    // there are many useful properties on channel.state and the client object
    const otherMember = Object.keys(channel.state.members).filter(
      (user) => user !== client.userID
    );
    return otherMember.length ? otherMember : "Lobby";
  };

  return (
    <div className="channel-header">
      <h1 className="to">{`To: ${getOtherMember()}`}</h1>
      <h2 className="extra-channel-data">
        {!messages.length && channel.data.name
          ? channel.data.name
          : channel.id === "lobby"
          ? "This is a Livestream Channel Type - every user has read and write permissions by default"
          : `This is the start of your 1:1 message history with `}
      </h2>
    </div>
  );
}
