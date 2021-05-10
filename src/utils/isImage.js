export function isImage(message) {
  return message.attachments.length ? "-thumbnail" : "";
};
