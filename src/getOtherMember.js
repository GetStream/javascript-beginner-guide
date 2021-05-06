export const getOtherMember = (id, chatClient) => {
  // there are many useful properties on channel.state and the client object
  const otherMember = Object.keys(id.state.members).filter(
    (user) => user !== chatClient.userID
  );
  return otherMember.length ? otherMember[0] : "Lobby";
};
