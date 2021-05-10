export function isMe (message, chatClient) {
  return message.user.id === chatClient.userID ? "me" : "not-me";
};
