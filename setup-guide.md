# Stream Chat Essentials: Set-Up Guide #
This is a step-by-step guide designed to provide context on basic concepts of Stream's Chat API. Additional information may be found in the [official documentation](https://getstream.io/chat/docs/?language=javascript). The purpose of this guide is to provide steps to build a simple chat app and showcase Stream Chat basic concepts, use, and best practices.

To try out this example React app, clone this repo and set up your .env files with your app key and secret ([instructions](https://github.com/zacheryconverse/basic-chat#install-example-app)). Follow these steps to build a chat app from scratch. This guide will include many links to files in this repo to show how certain methods are implemented.

This guide assumes knowledge of ES6 syntax such as async functionality. For reference to building a basic NodeJS/ExressJS server review our server file [here](https://github.com/zacheryconverse/basic-chat/blob/main/server/index.js).

Concepts covered in this guide:
- Instantiate Stream Chat client (client-side & server-side)
- Create tokens
- Connect/disconnect user
- Create channels
- Send messages to a channel
- Add users to chat app
- Listen for events

## Set Up Environment ##
1. Install Stream `npm install stream-chat` or `yarn add stream-chat`.
2. [Import StreamChat into your project](https://github.com/zacheryconverse/basic-chat/blob/b6c73c96278cc739def1a6a745f9fbcaf42f4032/src/App.js#L2)
```javascript
import { StreamChat } from 'stream-chat'
//or
const StreamChat = require('stream-chat').StreamChat;
```
3. Create a .env file at root level and another in the server folder
4. Create an account on [Stream](https://getstream.io/try-for-free/). Get Started for Free with an Unlimited 30-Day Chat Messaging Trial
5. Go to your Stream [Dashboard](https://dashboard.getstream.io/dashboard/v2/) to find your app key and secret
6. Add your app key to the root .env file you created:
```javascript
REACT_APP_KEY=your-app-key
```
7. Add your app key and secret to the .env file you created in the server folder:
```javascript
REACT_APP_KEY=your-app-key
REACT_APP_SECRET=your-app-secret
```
> Your key and secret are sensitive information that should not be public.

<sub><sup>For more info on working with .env files, check out [this article](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786). </sub></sup>
![Dashboard App](https://user-images.githubusercontent.com/32964891/117043503-8c2c0b00-acca-11eb-9991-5dd10b5ebc1f.png)

## Instantiate StreamChat ##
Two instances of StreamChat are required - one on the client-side and one on the server-side. A number of methods require the server-side client, such as generating user tokens and updating user roles/permissions. [Here](https://getstream.zendesk.com/hc/en-us/articles/360061669873-How-do-the-Chat-Client-Server-Stream-API-communicate-with-each-other-) is an article with more info on how the client and server sides interact.

1. Instantiate a client-side client instance. This can be used to connect/disconnect users, retrieve user info, and more.
```javascript
const chatClient = StreamChat.getInstance(YOUR_APP_KEY);`
```
[https://github.com/zacheryconverse/basic-chat/blob/b6c73c96278cc739def1a6a745f9fbcaf42f4032/src/App.js#L18](Example In Repo)

2. In a separate file, create a server-side chat instance. This can be used to create users, and generate tokens, among other things.
```javascript
const serverClient = StreamChat.getInstance(YOUR_APP_KEY, YOUR_APP_SECRET);
```
[https://github.com/zacheryconverse/basic-chat/blob/b6c73c96278cc739def1a6a745f9fbcaf42f4032/server/index.js#L10](Example In Repo)

3. Finally, create a server in that same server file. Copy over [this server code](https://github.com/zacheryconverse/basic-chat/blob/main/server/index.js) and run `node index.js` to spin up the server.

## Server Side - Upsert Users ##

You can add a user by running the upsertUser() method, or multiple users by running upsertUsers(). This method is included in the `server/index.js` file and automatically runs when you start the server.

```javascript
const userArray = [
 { id: "Stephen" },
 { id: "Zach" },
 { id: "Cody" },
 { id: "Chantelle" },
 { id: "Suki" },
 { id: "Shweta" },
];

const upsertMany = async (users) => {
 return await serverClient.upsertUsers(users);
};

upsertMany(userArray)
```
*After you have started the server and upserted these users, comment out this bit of code*

When upserting a user, `id` is a required field. You're free to add custom parameters too. More info [here](https://getstream.io/chat/docs/node/update_users/?language=javascript) on user creation.

If you look in the Chat Explorer within your Dashboard, you can see all of your new users.
[upsertUser in the repo](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/server/methods.js#L13)
 ![chatexplorer](https://user-images.githubusercontent.com/32964891/117075467-1e93d500-acf2-11eb-8277-bcef235d0113.gif)
 *Finding the Chat Explorer in your dashboard*


 *`upsertUser()` is necessary to add members to your application without connecting them with `connectUser()` - which will increase your monthly MAUs.*

## Server Side - Generate Token ##
Before you connect to the client as a user, you need to generate a user token. Your serverClient has a method built-in that generates a user token for you. On your server-side, run `serverClient.createToken(your_user_id)`
More info on best practices for token creation in [this](https://getstream.zendesk.com/hc/en-us/articles/360060576774-Token-Creation-Best-Practices) article.


## Connect User ##
Now that you’ve created your list of users, it’s time to log yourself in using the `connctUser()` method.
Log in by taking your server-side generated token and running `chatClient.connectUser({ id: your_user_id }, your_token)`
[Passing token from server to client side in the repo, and connecting](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Login.js#L8)

*Running `connectUser()` with a user that has not already been added using `upsertUser()` will automatically upsert the user for you.*

## Create Lobby ##
In this guide we use two channel types: livestream and messaging. There is more information on different channel types later on in this guide.
First we will create a livestream channel, and call it 'Lobby'.

1. Create and watch the channel.
```javascript
const channel = chatClient.channel("livestream", "lobby");
channel.watch()
```
Here, on the first line, we are instantiating a 'livestream' channel, and then by calling `channel.watch()` we are subscribing to events on this channel, such as when a new message is sent. `channel.watch()` also creates a new channel if it doesn't already exist.
[Creating livestream channel in repo](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Lobby.js#L12)

2. Send A Message
We're the only person in this lobby right now, but that's okay, we can still send a message by running
`channel.sendMessage({ text: 'Hello' })`
[Sending a message in repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/MessageInput.js#L13)

## Get User List ##
We've gone over creating a lobby and sending a message. Let's fetch a list of users and create a one-on-one style chat.

Since you've already run `upsertUsers` and have a list of users in your app, you can query for these users. Otherwise, if you are the only user in your app, you'll want to [logout](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Login.js#L20) by running `chatClient.disconnectUser()`, then go back and run `chatClient.connectUser()` again with a second user id before continuing.

1. Before we start a chat with somebody, we need to see all of the users of our application, which we can do by running the `queryUsers` method. This method is quite flexible. You can use it to filter users by `id` and custom fields, and sort the results by `last_active` or `created_at` date. It also has a `limit` and `offset` option if you want to implement pagination. The method also allows the client to subscribe to presence changes.

Refer to [this page](https://getstream.io/chat/docs/node/query_users/?language=javascript) in the docs for more info.

For this user list, we are going to query all users with a limit of 10 so we can get a list of users we can chat with, and sort it by the most recently created.

*There are a lot of ways to query. You can query for channels, query for users, and members of channels. Learn more about query syntax [here](https://getstream.io/chat/docs/react/query_syntax/?language=js)*

```javascript
const getUsers = async () => {
  const filter = { id: { $ne: client.userID } };
  const sort = { last-active: -1 }
  const response = await chatClient.queryUsers(filter, sort, { limit: 10 })
  return response
  }

  getUsers()
```
The response of getUsers() will return a list of users.

[Link to querying users in the repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/UserList.js#L10)


## Create 1-On-1 Chat Channel ##
Now that we have our list of users, we can create a 'messaging' type channel by running `client.channel()` and passing in a channel type and an object with an array of members, then running the `create` method.
Let's say we want to start a chat with Suki...
```javascript
const channel = chatClient.channel('messaging', {
 members: [client.user.id, 'Suki'],
})

await channel.watch()
```

You can also add custom parameters to this channel if you'd like, for example:
```javascript
const channel = chatClient.channel('messaging', {
 members: [client.user.id, 'Suki'],
 name: `This is a 'Messaging' Channel Type. ${client.userID} & Suki have role 'channel_member' which has read & write permissions by default`,
})
```

[Link to creating channel in repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/User.js#L68)

*In this example we are leaving out an optional ‘id’ field as the second argument of .channel(). This field can be used to create a custom channel name, but for 1 on 1 instances it's best practice to have the API autogenerate a channel id.*

*
*A common approach is to restrict channel creation to your server by running `channel.create()`. `channel.watch()` is suggested for client-side use, where as `channel.create()` is required for server-side. More info on watching channels [here](https://getstream.io/chat/docs/node/watch_channel/?language=javascript)*

*If you have already created this channel before, you don't need to do this step and can just get the channel instance, which is covered in the following step.*

## Send A Message ##

Now that we’ve created and started watching our channel instance, run its `sendMessage()` method. A channel instance also includes lots of other
information, such as the `created_by` field, and `member_count`.

```javascript
channel.sendMessage({ text: "Hi Friend!" })
```

Now if you log in as the other user, you can see this message show up when you access this channel.

```javascript
const channel = chatClient.channel('messaging', {
 members: [client.user.id, 'Stephen'],
})

await channel.watch()
```

## Query Channels ##
Rewrite all this vvvv
To access the channel instance and its methods, you need the channelID, which you can get from the `queryChannels()` method. `queryChannels` will return channel state and automatically watch the channel. In the following example, we will create a filter that checks for you and the other user, run `queryChannels`, and take the relavent channel ID from its response. From there, we can instantiate the channel. `queryChannels` by default watches the channel, so there is no need to call `.watch()` in this instance. More info on querying channels in [the docs](https://getstream.io/chat/docs/node/query_channels/?language=javascript).

```javascript
  let channelID;
  const filter = {type: "messaging", members: { $eq: [client.userID, userID] }}
  const channels = await chatClient.queryChannels(filter).then(response => channelID = channels[0].id)
  const channel = chatClient.channel('messaging', channelID)
}
```



## Listening for Events ##

When a message is sent, you'll likely want this to render instantly in your app. If you're watching a channel, you are subscribed to the channel and can listen for its events. For a complete list of events, refer to [this page](https://getstream.io/chat/docs/react/event_object/?language=js) in the docs.
In this case, we want to listen for `message.new` and so we can trigger a re-render of our message list when a new message is sent.
Listening for an event is as simple as running the `on` method on your channel instance. For example,
```javascript
channel.on('message.new', event => {
    console.log(event.message)
    // double check what this is*****
});
```

***Link to repo where we listen for event***


## Channel Types & User Permissions ##
At this point, we have covered the basics of what you will need to get up-and-running with a simple chat app.
The next thing you might want to learn about is channel types. So far, we've been working with the 'messaging' channel type. However, if you want to implement a Twitch-style live chat, you can use a 'livestream' channel type. Other channel types include 'team' and 'commerce', and you can also create your own channel types. You can go [here](https://getstream.io/chat/docs/node/channel_features/?language=javascript) for more information.

The difference between these channel types is their default user permissions. For example, in a 'messaging' channel type, a user must have the role of 'member' to read the channel, but in a livestream style chat, you can read the channel with the role of 'user'. For a more complete list of default permissions, refer to [this page](https://getstream.io/chat/docs/node/channel_permission_policies/?language=javascript) in the docs.

All of these user permissions are fully customizable, and you can access these permissions in your dashboard.
If you go to your dashboard, click on your app, then on Chat > Overview, you will see the full list of permissions in a JSON file at the bottom of the page.
In addition to the permissions, you are provided with lots of other options. A commonly used option is to enable the blocklist, which will block messages that contain profanity.

## Pagination ##

A best practice for many query methods like `queryUsers` or `queryChannels` is to take advantage of [pagination logic](https://getstream.io/chat/docs/node/channel_pagination/?language=javascript). Since querying is a relatively heavy API request, it is recommended to take advantage of `limit` and `offset` parameters when querying users, channels, or messages. The `limit` parameter sets the amount of items to be returned, and the `offset` parameter determines the starting index of the query.
[Here](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/UserList.js#L27) is a section of the repo that takes advantage of pagination logic.
