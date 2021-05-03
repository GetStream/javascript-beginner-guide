import React from "react";

export default function Avatar({ user }) {
  const color = `#${Math.floor(Math.random() * 16777215).toString(
          16
        )}`
  return (
    <div
      className="avatar"
      style={{
        backgroundColor: color,
      }}
    >
      {user?.id[0].toUpperCase()}
    </div>
  );
}
