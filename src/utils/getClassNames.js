export function getClassNames(message, chatClient) {
  let classNames = "";
  classNames += message.user.id === chatClient.userID ? "me" : "not-me";
  /** The API will enrich the message object with
          attachments for the first URL found in a message.text
            https://getstream.io/chat/docs/javascript/message_format/?language=javascript */
  classNames += message.attachments.length ? "-thumbnail" : "-text-message";
  return classNames;
};
