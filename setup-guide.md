# Stream Chat Essentials: Set-Up Guide

The following guide provides steps on how to quickly build chat leveraging Stream's Chat API and to showcase Stream Chat basic concepts, use, and best practices.

Additional information may be found in the following:
- [Official Documentation](https://getstream.io/chat/docs/?language=javascript)
- [Knowledge Base](https://getstream.zendesk.com/hc/en-us/)
- [Stream Blog](https://getstream.io/blog/topic/tutorials/chat/)

To try out this example chat app, follow the instructions in the [README](https://github.com/GetStream/javascript-beginner-guide#readme).

To build a chat app from scratch, follow these steps and reference the files in this repo. This guide will include many links to files in this repo to showcase how certain methods may be implemented.

This guide assumes knowledge of ES6 syntax such as async functionality as well as basic http requests. For reference to building a simple NodeJS/ExressJS server, review our server file [here](https://github.com/GetStream/javascript-beginner-guide/blob/main/server/index.js).

Concepts covered in this guide:

- Instantiate Stream Chat client (client-side & server-side)
- Create tokens
- Connect/disconnect user
- Create channels
- Send messages to a channel
- Add members to channels
- Add users to chat app
- Listen for events

## Set Up Environment

1. Install Stream Chat

```
npm install stream-chat
// or
yarn add stream-chat
```

2. [Import StreamChat into your project](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/ChatClientContext.js#L2)

```javascript
import { StreamChat } from "stream-chat";
//or
const StreamChat = require("stream-chat").StreamChat;
```

3. Create a .env file at root level and another in the server folder
4. Create an account on [Stream](https://getstream.io/try-for-free/). Get Started for Free with an Unlimited 30-Day Chat Messaging Trial
5. Go to your Stream [Dashboard](https://dashboard.getstream.io/dashboard/v2/) to find your app key and secret
6. Add your app key to the root .env file you created:

```javascript
REACT_APP_KEY=your_app_key;
```

7. Add your app key and secret to the .env file you created in the server folder:

```javascript
REACT_APP_KEY=your_app_key;
REACT_APP_SECRET=your_app_secret;
```

> Your key and secret are sensitive information that should not be public.
> For more info on working with .env files, check out [this article](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786).

![Dashboard App](https://user-images.githubusercontent.com/32964891/117043503-8c2c0b00-acca-11eb-9991-5dd10b5ebc1f.png)

## Instantiate StreamChat

Two instances of StreamChat are required - one on the client-side and one on the server-side. A number of methods require the server-side client, such as generating user tokens and updating user roles/permissions. [Here](https://getstream.zendesk.com/hc/en-us/articles/360061669873-How-do-the-Chat-Client-Server-Stream-API-communicate-with-each-other-) is an article with more info on how the client and server sides interact.

1. Instantiate a client-side client instance. This can be used to connect/disconnect users, retrieve user info, and more.

```javascript
const chatClient = StreamChat.getInstance(YOUR_APP_KEY);
```

[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/ChatClientContext.js#L13)

2. In a separate file, instantiate a server-side client instance. This will be used to generate tokens, upsert users, and any method that is required to be called server-side.

```javascript
const serverClient = StreamChat.getInstance(YOUR_APP_KEY, YOUR_APP_SECRET);
```

[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/server/index.js#L11)

3. Create a server in the same server file. For reference, review our server file [here](https://github.com/GetStream/javascript-beginner-guide/blob/main/server/index.js)

4. Spin up the server.

```
node server/index.js
```

## Server Side - Upsert Users

Add a user to an app by calling `upsertUser()`. Add multiple users by calling `upsertUsers()`.
This method is included in `server/methods.js` and will be called by running:

```
npm run upsertUsers
```

```javascript
const upsertMany = async () => {
  const usersArray = [
    { id: "Stephen" },
    { id: "Zach" },
    { id: "Cody" },
    { id: "Chantelle" },
    { id: "Suki" },
    { id: "Shweta" },
    { id: "Steve" },
    { id: "Collin" },
    { id: "Chandler" },
    { id: "Sara" },
    { id: "Sharon" },
  ];

  return await serverClient.upsertUsers(usersArray);
};
```

`upsertUsers()` requires `id` as a field. Custom fields may be additionally included. More info [here](https://getstream.io/chat/docs/node/update_users/?language=javascript) on user creation.

[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/be1ca53c3eec633f301deed69ea3030529152d6c/server/methods.js#L16)

<img width="1357" alt="Chat Explorer" src="https://user-images.githubusercontent.com/32964891/117172627-366a6800-ad89-11eb-91f2-e958bc57bb0f.png">

> Use the Chat Explorer in your dashboard to see a list of users

> It is also possible to add users to an app with connectUser() - but this will affect monthly MAUs. upsertUser() is necessary to add members in bulk to your app without connecting them (and increasing your bill - if on a paid plan).

## Server Side - Generate Token

In order to connect a user on the client side, a token needs to be generated on the server side with `createToken()`.

In `server/index.js`:
```javascript
const token = serverClient.createToken('Cody')
```

In production environments it is common to set an expiry date for the token, which can be passed as the second argument as seen below. 
```javascript
  const token = serverClient.createToken('Cody', Math.floor(Date.now() / 1000) + (60 * 45));
```
This will set the token to expire in 45 minutes from the current time.
[Example in Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/server/index.js#L24)


More info on best practices for token creation can be found in [this](https://getstream.zendesk.com/hc/en-us/articles/360060576774-Token-Creation-Best-Practices) article.

> Because the serverClient includes an app secret, the server is able to combine the given user id with the secret to generate a user specific token

## Connect User

Pass the server-side generated token to the client-side in a response and include it in `connectUser()` along with a user id:
```javascript
await chatClient.connectUser({ id: 'Cody' }, user_specific_token)
```

Or, if the token is set to expire, pass an async function that returns the response from your token request as the second argument of `connectUser()`
```javascript
await chatClient.connectUser(
    { id: 'Cody' },
    async () => {
        // make a request to your own backend to get the token - token lives on response.data
        const response = await httpBackend.post("/chat-token/", 'Cody');
        return response.data;
    }
);
```

[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/Login.js#L16)
[More info in the Docs](https://getstream.io/chat/docs/node/tokens_and_authentication/?language=javascript#token-expiration)
> Every token is specific to a user

> Calling `connectUser()` with a user that has not been added to the app will automatically upsert the user for you.

## Create Lobby

In this guide two channel types are used: 'livestream' and 'messaging'. More information on channel types may be found later on in this guide.

Create a 'livestream' channel, and give it an id of 'lobby'.

1. Create and watch a channel:

```javascript
const channel = chatClient.channel("livestream", "lobby");
await channel.watch();
```

Instantiate a 'livestream' channel with `channel()`.

Subscribe to events on a channel, such as when a new message is received (`message.new`), by calling `channel.watch()`, which also creates a new channel if it doesn't already exist.

[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/Lobby.js#L17)

2. Send a message to channel:

```javascript
await channel.sendMessage({ text: 'Hello' })
```
[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/MessageInput.js#L16)

## Get List of Users

The users that were added by `upsertUsers()` earlier will be queried. If users have not been added to the app, the client will need to [disconnect](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/Login.js#L27) by calling:
```javascript
await chatClient.disconnectUser()
```
Then call `chatClient.connectUser()` again with a different user id.
### Query Users
`queryUsers()` will return an object with an array of users in the app.

Filter users by `id` and/or by custom fields. Sort the users by `last_active` or by `created_at` date.

The options `limit` and `offset` may be used to implement pagination.

`queryUsers()` also allows the client to subscribe to presence change events.


Refer to [this page](https://getstream.io/chat/docs/node/query_users/?language=javascript) in the docs for more info on `queryUsers()`.

> Stream Chat has many query methods such as `queryUsers()`, `queryMembers()`, and `queryChannels()`. Learn more about query syntax [here](https://getstream.io/chat/docs/react/query_syntax/?language=js)

1. Query all users, with a filter that excludes an id that is 'not equal' ($ne) to your client id 'and' ($and) a last_active value that is 'Greater Than' ($gt) a date that predates the app, with a limit of 10 and sorting them by the most recently active.

```javascript
const getUsers = async () => {
  const filter = const filter = {
        $and: [
          { id: { $ne: chatClient.userID } },
          { last_active: { $gt: "2000-01-01T00:00:00.000000Z" } },
        ],
      };
  const sort = { last_active: -1 };
  const options = { limit: 10 };
  return await chatClient.queryUsers(filter, sort, options)
  }
```

[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/UserList.js#L16)


Another option is to implement the 'autocomplete' search feature, which will return partial matches. 
```javascript
await chatClient.queryUsers({
          id: { $autocomplete: text },
        });
```
[Example in Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/UserList.js#L36)
More info on autocomplete [in the docs](https://getstream.io/chat/docs/node/query_users/?language=javascript#querying-using-the-$autocomplete-operator)
## Get or Create a 1-On-1 Channel

1. Instantiate a channel by passing the 'messaging' channel type to `client.channel()` as well as an array of members. Then call `channel.watch()`.

To start a chat with Suki...

```javascript
const channel = chatClient.channel("messaging", {
  members: [chatClient.userId, "Suki"],
});

await channel.watch();
```

Optionally, add custom fields to a channel such as this 'name' field:

```javascript
const channel = chatClient.channel("messaging", {
  members: [chatClient.userId, "Suki"],
  name: `This is a 'Messaging' Channel Type. ${chatClient.userID} & Suki have role 'channel_member' which has read & write permissions by default`,
});
```

[Example In Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/UserOrChannel.js#L25)

> In this example, the optional ‘id’ field is left out as the second argument of `.channel()`. This field is used to define the channel id. Here, the API will generate a channel id based on the channel type and members.

> A channel may also be called by providing the channel id as the second argument of `.channel()`

> `channel.create()` will not listen for events when creating a channel server-side. Whereas, `channel.watch()` is suggested for client-side use.

> More info on watching channels [here](https://getstream.io/chat/docs/node/watch_channel/?language=javascript)

> Subsequent calls to `watch()` with a channel that already exists will not create a duplicate channel - nor will it update any fields such as 'members' or 'name'.

2. Send A Message to 1-on-1 channel

To send a message to a channel, call `channel.sendMessage()` passing in a 'text' field.

```javascript
await channel.sendMessage({ text: "Hi Friend!" });
```

## Query Channels

`queryChannels` can be used to get a list of channels. Like `queryUsers`, it takes 3 arguments: filter, sort, and options.
Query your app for channels you are a member of, and sort them by the most recent message sent.

The following query will return the first 10 'messaging' channel types that the client is a member of, sorted by the most recent message.

```javascript
  const filter = { type: "messaging", members: { $in: [chatClient.userId] } };
  const sort = { last_message_at: -1 };
  const options = { limit: 10 }
  const result = await chatClient.queryChannels(filter, sort, limit);
```

More info on querying channels in [the docs](https://getstream.io/chat/docs/node/query_channels/?language=javascript).



## Listening for Events

If a client is watching a channel, they are subscribed to the channel and can listen for updates to the channel. For a complete list of events, refer to [this page](https://getstream.io/chat/docs/react/event_object/?language=js) in the docs.
Listen for new message events by calling `on` on a channel instance.

```javascript
channel.on("message.new", (event) => {
  console.log(event.message);
});
```
[Example in Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/OneOnOne.js#L35)

## Channel Types & User Permissions

The 'messaging' and 'livestream' channel types have been covered in this guide. Other default channel types include 'team' and 'commerce'. You may also create your own channel types.

The difference between channel types is their default user permissions. For a complete list of default permissions, refer to [this page](https://getstream.io/chat/docs/node/channel_permission_policies/?language=javascript) in the docs.

All user permissions are customizable. You may access these permissions in your dashboard by navigating to your App, then Chat > Overview, and select the relevant channel type you would like to customize.

## Pagination

A best practice for many query methods like `queryUsers` or `queryChannels` is to take advantage of [pagination logic](https://getstream.io/chat/docs/node/channel_pagination/?language=javascript). Since querying is a relatively heavy API request, it is recommended to take advantage of `limit` and `offset` parameters when querying users, channels, or messages. The `limit` parameter sets the amount of items to be returned, and the `offset` parameter determines the starting index of the query.
[Example in Repo](https://github.com/GetStream/javascript-beginner-guide/blob/main/src/components/UserList.js#L70).

## Adding Reactions

StreamChat allows users to add custom reactions to a message. All you need is the message ID.
```javascript
await channel.addReaction('messageID', {
  type: 'like'
})
```
[Adding Reactions in the Docs](https://getstream.io/chat/docs/node/send_reaction/?language=javascript)
## Threaded Messages

A user may also add threaded responses to any message with the message ID.
```javascript
channel.sendMessage({ 
    text: 'Hey, I am replying to a message!', 
    parent_id: messageID
})
```
[Adding Threaded Replies in the Docs](https://getstream.io/chat/docs/node/threads/?language=javascript)

> Threaded replies and reactions can be enabled or disabled in your dashboard under Chat Overview > Channel Types
