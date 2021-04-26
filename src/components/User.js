import React from "react";

export default function User({ user }) {
  return <li key={user.created_at}>{user.id}</li>;
}
