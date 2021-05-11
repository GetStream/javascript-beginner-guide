import React, { useState, createContext } from "react";
import { StreamChat } from "stream-chat";
require("dotenv").config({ path: "../.env" });

// The key (and secret) exist in the Dashboard
// Dashboard - https://getstream.io/accounts/login/
const appKey = process.env["REACT_APP_KEY"];

export const ChatClientContext = createContext();

export const ChatClientProvider = (props) => {
  // Instantiate client on client-side with app key
  //   https://getstream.io/chat/docs/javascript/?language=javascript
  const [chatClient, setChatClient] = useState(StreamChat.getInstance(appKey));
  return (
    <ChatClientContext.Provider value={chatClient}>
      {props.children}
    </ChatClientContext.Provider>
  );
};
