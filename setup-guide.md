# Stream Chat Concepts: Set-Up Guide

The following guide provides steps on how to quickly build chat leveraging Stream's Chat API and to showcase Stream Chat basic concepts, use, and best practices.

Additional information may be found in the following:
- [Official Documentation](https://getstream.io/chat/docs/?language=javascript)
- [Knowledge Base](https://getstream.zendesk.com/hc/en-us/)
- [Stream Blog](https://getstream.io/blog/topic/tutorials/chat/)

To try out this example chat app, follow the instructions in the [README](https://github.com/zacheryconverse/basic-chat#install-example-app).

To build a chat app from scratch, follow these steps and reference the files in this repo. This guide will include many links to files in this repo to showcase how certain methods may be implemented.

This guide assumes knowledge of ES6 syntax such as async functionality as well as basic http requests. For reference to building a simple NodeJS/ExressJS server, review our server file [here](https://github.com/zacheryconverse/basic-chat/blob/main/server/index.js).

Concepts covered in this guide:

- Initialize Stream Chat client (client-side & server-side)
- Create tokens
- Connect/disconnect user
- Create channels
- Send messages to a channel
- Add users to chat app
- Listen for events

## Set Up Environment

1. Install Stream Chat

```
npm install stream-chat
// or
yarn add stream-chat
```

2. [Import StreamChat into your project](https://github.com/zacheryconverse/basic-chat/blob/b6c73c96278cc739def1a6a745f9fbcaf42f4032/src/App.js#L2)

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

## Initialize StreamChat

Two instances of StreamChat are required - one on the client-side and one on the server-side. A number of methods require the server-side client, such as generating user tokens and updating user roles/permissions. [Here](https://getstream.zendesk.com/hc/en-us/articles/360061669873-How-do-the-Chat-Client-Server-Stream-API-communicate-with-each-other-) is an article with more info on how the client and server sides interact.

1. Initialize a client-side client instance. This can be used to connect/disconnect users, retrieve user info, and more.

```javascript
const chatClient = StreamChat.getInstance(YOUR_APP_KEY);
```

[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/b6c73c96278cc739def1a6a745f9fbcaf42f4032/src/App.js#L18)

2. In a separate file, initialize a server-side client instance. This will be used to generate tokens, and upsert users.

```javascript
const serverClient = StreamChat.getInstance(YOUR_APP_KEY, YOUR_APP_SECRET);
```

[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/b6c73c96278cc739def1a6a745f9fbcaf42f4032/server/index.js#L10)

3. Create a server in the same server file. For reference, review our server file [here](https://github.com/zacheryconverse/basic-chat/blob/main/server/index.js)

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
    { id: "Zach" },
    { id: "Collin" },
    { id: "Chandler" },
    { id: "Sara" },
    { id: "Sharon" },
  ];

  return await serverClient.upsertUsers(usersArray);
};
```

`upsertUsers()` requires `id` as a field. Custom fields may be additionally included. More info [here](https://getstream.io/chat/docs/node/update_users/?language=javascript) on user creation.
[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/server/methods.js#L13)

<img width="1357" alt="Chat Explorer" src="https://user-images.githubusercontent.com/32964891/117172627-366a6800-ad89-11eb-91f2-e958bc57bb0f.png">
> Use the Chat Explorer in your dashboard to see a list of users

> It is also possible to add users to an app with `connectUser()` - but this will affect monthly MAUs. `upsertUser()` is necessary to add members in bulk to your app without connecting them (and increasing your bill).

## Server Side - Generate Token

In order to connect a user on the client side, a token needs to be generated on the server side with `createToken()`.

In `server/index.js`:
```javascript
serverClient.createToken('Cody')
```
> Because the `serverClient` includes an app secret, it combines the given user id with the secret to generate a user specific token
More info on best practices for token creation can be found in [this](https://getstream.zendesk.com/hc/en-us/articles/360060576774-Token-Creation-Best-Practices) article.

## Connect User

Pass the server-side generated token to the client-side in a response and include it in `connectUser()` along with a user id:
```javascript
chatClient.connectUser({ id: 'Cody' }, user_specific_token)
```
[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Login.js#L8)
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

Initialize a 'livestream' channel with `channel()`.
Subscribe to events on a channel, such as when a new message is received (`message.new`), by calling `channel.watch()`, which also creates a new channel if it doesn't already exist.
[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Lobby.js#L12)

2. Send a message to channel:

```javascript
channel.sendMessage({ text: 'Hello' })
```
[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/MessageInput.js#L13)

## Get List of Users

The users that were added by `upsertUsers()` earlier will be queried. If users have not been added to the app, the client will need to [disconnect](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Login.js#L20) by calling:
```javascript
await chatClient.disconnectUser()
```
Then call `chatClient.connectUser()` again with a different user id.

`queryUsers()` will return an object with an array of users in the app. Filter users by `id` and/or by custom fields. Sort the users by `last_active` or by `created_at` date. The options `limit` and `offset` may be used to implement pagination. `queryUsers()` also allows the client to subscribe to presence change events.

Refer to [this page](https://getstream.io/chat/docs/node/query_users/?language=javascript) in the docs for more info on `queryUsers()`.

> Stream Chat has many query methods such as `queryUsers()`, `queryMembers()`, and `queryChannels()`. Learn more about query syntax [here](https://getstream.io/chat/docs/react/query_syntax/?language=js)

1. Query all users with a limit of 10 and sort them by the most recently active.

```javascript
const getUsers = async () => {
  const filter = { id: { $ne: client.userID } };
  const sort = { last_active: -1 };
  const options = { limit: 10 };
  return await chatClient.queryUsers(filter, sort, options)
  }
```

[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/UserList.js#L10)

## Get or Create a 1-On-1 Channel

1. Initialize a channel by passing the 'messaging' channel type to `client.channel()` as well as an array of members. Then call `channel.watch()`.

To start a chat with Suki...

```javascript
const channel = chatClient.channel("messaging", {
  members: [chatClient.user.id, "Suki"],
});

await channel.watch();
```

Optionally, add custom fields to a channel such as this 'name' field:

```javascript
const channel = chatClient.channel("messaging", {
  members: [chatClient.user.id, "Suki"],
  name: `This is a 'Messaging' Channel Type. ${client.userID} & Suki have role 'channel_member' which has read & write permissions by default`,
});
```

[Example In Repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/User.js#L68)

> In this example, the optional ‘id’ field is left out as the second argument of `.channel()`. This field is used to define the channel id. Here, the API will generate a channel id based on the channel type and members.

> A channel may also be called by providing the channel id as the second argument of `.channel()`

> To restrict channel creation to your server, use  `channel.create()`, which will not listen for events. Whereas, `channel.watch()` is suggested for client-side use.

> More info on watching channels [here](https://getstream.io/chat/docs/node/watch_channel/?language=javascript)

> Subsequent calls to `watch()` with a channel that already exists will not create a duplicate channel - nor will it update any fields such as 'members' or 'name'.

2. Send A Message to 1-on-1 channel

To send a message to a channel, call `channel.sendMessage()` passing in a 'text' field.

```javascript
channel.sendMessage({ text: "Hi Friend!" });
```

## Query Channels

`queryChannels` can be used to get a list of channels. Like `queryUsers`, it takes 3 arguments: filter, sort, and options.
Query your app for channels you are a member of, and sort them by the most recent message sent.

The following query will get all 'messaging' channel types that you are a member of, sort by the most recent message, and return the first 10 results.

```javascript
  const filter = { type: "messaging", members: { $in: [chatClient.user.id] } };
  const sort = { last_message_at: -1 };
  const options = { limit: 10 }
  const result = await chatClient.queryChannels(filter, sort, limit);
```

More info on querying channels in [the docs](https://getstream.io/chat/docs/node/query_channels/?language=javascript).



## Listening for Events

When a message is sent, you'll likely want this to render instantly in your app. If you're watching a channel, you are subscribed to the channel and can listen for its events. For a complete list of events, refer to [this page](https://getstream.io/chat/docs/react/event_object/?language=js) in the docs.
In this case, we want to listen for `message.new` and so we can trigger a re-render of our message list when a new message is sent.
Listening for an event is as simple as running the `on` method on your channel instance. For example,

```javascript
channel.on("message.new", (event) => {
  console.log(event.message);
});
```

[https://github.com/zacheryconverse/basic-chat/blob/2e0275475f238b2d5d4d290e21cbcbdd5b0361ec/src/components/OneOnOne.js#L24](Example in Repo)

## Channel Types & User Permissions

At this point, we have covered the basics of what you will need to get up-and-running with a simple chat app.
The next thing you might want to learn about is channel types and their associated user permissions. So far, we've been working with the 'messaging' and 'livestream' channel types. Other channel types include 'team' and 'commerce'. You may also create your own channel types.

The difference between channel types is their default user permissions. For a complete list of default permissions, refer to [this page](https://getstream.io/chat/docs/node/channel_permission_policies/?language=javascript) in the docs.

All of these user permissions are fully customizable; you may access these permissions in your dashboard by navigating to your App, then on Chat > Overview, then selecting the relavent channel type you'd like to customize permissions for. 

## Pagination

A best practice for many query methods like `queryUsers` or `queryChannels` is to take advantage of [pagination logic](https://getstream.io/chat/docs/node/channel_pagination/?language=javascript). Since querying is a relatively heavy API request, it is recommended to take advantage of `limit` and `offset` parameters when querying users, channels, or messages. The `limit` parameter sets the amount of items to be returned, and the `offset` parameter determines the starting index of the query.
[Here](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/UserList.js#L27) is a section of the repo that takes advantage of pagination logic.
