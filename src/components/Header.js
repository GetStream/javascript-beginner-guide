import { getOtherMember } from '../getOtherMember';

export default function Header({ messages, channel, chatClient }) {
  const to = getOtherMember(channel, chatClient);

  return (
    <div className="channel-header">
      <h1 className="to">{`To: ${to}`}</h1>
      <h2 className="extra-channel-data">
        {
          !messages.length && channel.data.name
            ? `This is the start of your 1:1 message history with ${to}`
            : channel.id === "lobby"
            ? "This is a 'Livestream' Channel Type. All 'roles' have read permissions by default"
            // channel.data.name is the custom field we added to the 1:1 channel on
              // creation -> channel.watch() in User.js
            : channel.id === 'you'
            ? 'This is a channel with only you. No one else can read your messages here'
            : channel.data.name
        }
      </h2>
    </div>
  );
}
