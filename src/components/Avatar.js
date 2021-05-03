export default function Avatar({ user }) {

  function stringToHslColor(str, s, l) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  }

  return (
    <div
      className="avatar"
      style={{
        backgroundColor: stringToHslColor(user.id, 30, 80),
      }}
    >
      {user?.id[0].toUpperCase()}
    </div>
  );
}
