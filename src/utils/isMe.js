export function isMe (message, chatClient) {
  return message.user.id === chatClient.userID ? "me-dm-time" : "not-me-dm-time";
};
