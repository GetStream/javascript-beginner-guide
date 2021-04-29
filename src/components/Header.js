export default function Header({ messages, channel, client }) {
  const getOtherMember = () => {
    return Object.keys(channel.state.members).filter(
      (user) => user !== client.userID
    );
  };

  return (
    <div className="channel-header">
      <h1 className="to">{`To: ${getOtherMember()}`}</h1>
      <h2 className="extra-channel-data">
        {!messages.length
          ? `This is the start of your 1:1 message history with `
          // channel data holds our custom extra data we included when creating the channel
          : channel.data.name}
      </h2>
    </div>
  );
}
