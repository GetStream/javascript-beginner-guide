export default function Avatar({ user }) {

  function stringToHslColor(str, s, l) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  }
  // console.log(user.state);
  // let name;
  // user.state ? name = user.state : name = user.id;
  let name = user.id
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
