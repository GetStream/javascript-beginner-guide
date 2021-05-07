import { getOtherMember } from "../getOtherMember";

export default function Avatar({ userOrChannel, chatClient }) {
  function stringToHslColor(str, s, l) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  }

  let name = userOrChannel.id;
  if (userOrChannel.state) {
    name = getOtherMember(userOrChannel, chatClient);
  }

  return (
    <div
      className="avatar"
      style={{
        backgroundColor: stringToHslColor(name, 50, 40),
      }}
    >
      {name[0].toUpperCase()}
    </div>
  );
}
