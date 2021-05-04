# Stream Chat Essentials: Set-Up Guide #
This is a step-by-step guide designed to give you context on some of the essential concepts of Stream's Chat API. You can find even more information in the [official documentation](https://getstream.io/chat/docs/?language=javascript) and [knowledge base](https://getstream.zendesk.com/hc/en-us/), but this guide is meant to take a more incremental approach to building a starter app and introducing you to some of the most commonly used features.

You can clone down this repo to see how the steps are implemented in this example React app, or you can follow these steps to build out your own app in a framework of your choosing.

This guide assumes you have some experience with ES6 JavaScript Snytax and async functionality. We will also be creating an ExpressJS server, but the vast majority of the functionality occurs on the client side, so feel free to reference [this server file](https://github.com/zacheryconverse/basic-chat/blob/main/server/index.js) if you like.

By the end of this guide, you will know how to instantiate the Stream chat client, create users in a chat app, create tokens, connect/disconnect, create chat channels, and send messages to channels.

## Set Up Environment ##
1. Install Stream `npm install stream-chat` or `yarn add stream-chat`.
2. Import StreamChat into your project
```
import { StreamChat } from 'stream-chat'
//or
const StreamChat = require('stream-chat').StreamChat;
```
3. Head to your [dashboard](https://dashboard.getstream.io/) and create a new App if you don't have one. Then, get your App Key and Secret. Since this is sensitive information for your app that you do not want public, store these in a seperate .env file.


<sub><sup>For more info on working with .env files, check out [this article](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786). </sub></sup>
![Dashboard App](https://user-images.githubusercontent.com/32964891/117043503-8c2c0b00-acca-11eb-9991-5dd10b5ebc1f.png)

4. We will need to create two instances of StreamChat, one on the client-side and one on the server-side. While the majority of your app will interact with Streams API client side, there are a few things that are required to occur server-side for security purposes, such as generating user tokens and updating user roles/permissions. [Here](https://getstream.zendesk.com/hc/en-us/articles/360061669873-How-do-the-Chat-Client-Server-Stream-API-communicate-with-each-other-) is an article with more info on how the server/client side connect.

Create a client-side chat instance. This can be used to log in/log out users, retrieve user info, get channels, and more.
`const client = StreamChat.getInstance(YOUR_APP_KEY);`

In a separate file, create a server-side chat instance. This can be used to create users, and generate tokens, among other things.
`const serverClient = StreamChat.getInstance(YOUR_APP_KEY, YOUR_APP_SECRET);`

5. Finally, create a server in that same server file. Feel free to copy [this server code](https://github.com/zacheryconverse/basic-chat/blob/main/server/index.js) to save some time.

## Create Users & Login ##

If you would like to start by just logging in as a user and not creating other users, skip to step 2.

1. You can add a user by running the upsertUser() method, or multiple users by running upsertUsers(). Let’s go to our server-side file and add a few people to our chat app!

```
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
When upserting a user, `id` is a required field. You're free to add custom parameters too. More info [here](https://getstream.io/chat/docs/node/update_users/?language=javascript) on user creation.

Now if you look in the Chat Explorer of your Dashboard, you can see all of your new users.
[upsertUser in the repo](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/server/methods.js#L13)

2. Now that you’ve created your list of users, it’s time to log yourself in. To do this, you need to generate a user token. Your serverClient has a method built-in that generates a user token for you. On your server-side, run `serverClient.createToken(your_name)`
More info on best practices for token creation in [this](https://getstream.zendesk.com/hc/en-us/articles/360060576774-Token-Creation-Best-Practices) article.


3. Log in by taking your server-side generated token and running `client.connectUser({ id: your_name }, your_token)`

*If you run this method with a user that has not already been added using `upsertUser`, it will automatically upsert the user for you. `upsertUser` is useful if you want to add members to your application without actually connecting them with `connectUser` - which can increase your monthly MAUs. *

[Passing token from server to client side in the repo, and logging in](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Login.js#L8)


## Create Lobby ##
In this guide we will make two styles of chat channels, a livestream style chat and a one on one style chat. There is more information on different channel types later on in this guide.
First we will create our livestream style chat, and call it 'Lobby'.

1. Create and watch the channel.
```
const channel = client.channel("livestream", "lobby");
channel.watch()
```
Here, on the first line, we are instantiating a 'livestream' style channel chat, and then by calling `channel.watch()` we are subscribing to events on this channel, such as when a new message is sent. `channel.watch()` also creates a new channel if it doesn't already exist.
[Creating livestream channel in repo](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Lobby.js#L12)

2. Send A Message
We're the only person in this lobby right now, but that's okay, we can still send a message by running
`channel.sendMessage({ text: 'Hello' })`
[Sending a message in repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/MessageInput.js#L13)

## Get User List ##
Okay, we've gone over creating a lobby and sending a message. Let's look at our list of users and create a one-on-one style chat.

If you've already run `upsertUsers` and have a list of users in your app, you can query for these users. If you are the only user in your app, you'll want to [logout](https://github.com/zacheryconverse/basic-chat/blob/3f857ac4785f08d5bb7e8ff41bb225776e5b808c/src/components/Login.js#L20) by running `client.disconnectUser()`, then go back and run `client.connectUser()` again with a second username before continuing.

1. Before we start a chat with somebody, we need to see all of the users of our application, which we can do by running the `queryUsers` method. This method is quite flexible. You can use it to filter users by `id`, their `last_active` or `created_at` date, whether they are banned, and more. It also has a `limit` and `offset` option if you want to implement pagination. Refer to [this page](https://getstream.io/chat/docs/node/query_users/?language=javascript) in the docs for more info.

For this 1-on-1 chat app, we are just going to query all users with a limit of 10 so we can get a list of users we can chat with, and sort it by the most recently created.

*There are a lot of ways to query. You can query for channels, query for users, and members of channels. Learn more about query syntax [here](https://getstream.io/chat/docs/react/query_syntax/?language=js)*

```
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
Now that we have our list of users, we can create a 'messaging' style chat channel by running `client.channel()` and passing in a channel type and an object with an array of members, then running the `create` method.
Let's say we want to start a chat with Suki...
```
const channel = client.channel('messaging', {
 members: [client.user.id, 'Suki'],
})

await channel.watch()
```

You can also add custom parameters to this channel if you'd like, for example:
```
const channel = client.channel('messaging', {
 members: [client.user.id, 'Suki'],
 name: `This is a 'Messaging' Channel Type. ${client.userID} & Suki have role 'channel_member' which has read & write permissions by default`,
})
```

[Link to creating channel in repo](https://github.com/zacheryconverse/basic-chat/blob/main/src/components/User.js#L68)
*In this example we are leaving out an optional ‘id’ field as the second argument of .channel(). This field can be used to create a custom channel name, but for 1 on 1 instances it's best practice to have the API autogenerate a channel id.*

*Another option is to run `channel.create()` instead of `channel.watch()`. Running `channel.watch()` will not only create the channel if it doesn't exist yet, but it will also tell the server to listen for any events that occur in a channel, such as when a new message is sent. This is a good practice if you're creating a new channel on the front-end, but if you are just creating a channel server-side and aren't concerned about subscribing to updates, you can run `channel.create()` More info on watching channels [here](https://getstream.io/chat/docs/node/watch_channel/?language=javascript)*

*If you have already created this channel before, you don't need to do this step and can just get the channel instance, which is covered in the following step.*


## Send A Message ##

Now that we’ve created and started watching our channel instance, run its `sendMessage()` method. A channel instance also includes lots of other useful information, such as the `created_by` field, and `member_count`.

```
channel.sendMessage({ text: "Hi Friend!" })
```

Now if you log in as the other user, you can see this message show up when you access this channel.

Let's say you've already created two channels, and you want to switch back to the other channel. You will have to re-instantiate the other channel. You can query for other channels that have already been created by using `queryChannels()`

To access the channel instance and its methods, you need the channelID, which you can get from the `queryChannels()` method. `queryChannels` will return channel state and automatically watch the channel. In the following example, we will create a filter that checks for you and the other user, run `queryChannels`, and take the relavent channel ID from its response. From there, we can instantiate the channel. `queryChannels` by default watches the channel, so there is no need to call `.watch()` in this instance. More info on querying channels in [the docs](https://getstream.io/chat/docs/node/query_channels/?language=javascript).

```
  let channelID;
  const filter = {type: "messaging", members: { $eq: [client.userID, userID] }}
  const channels = await client.queryChannels(filter).then(response => channelID = channels[0].id)
  const channel = client.channel('messaging', channelID)
}
```



## Listening for Events ##

When a message is sent, you'll likely want this to render instantly in your app. If you're watching a channel, you are subscribed to the channel and can listen for its events. For a complete list of events, refer to [this page](https://getstream.io/chat/docs/react/event_object/?language=js) in the docs.
In this case, we want to listen for `message.new` and so we can trigger a re-render of our message list when a new message is sent.
Listening for an event is as simple as running the `on` method on your channel instance. For example,
```
channel.on('message.new', event => {
    //Updating your message list in a stateful React component...
     setMessages(channel.state.messages);
});
```
## Channel Types & User Permissions ##
At this point, we have covered the basics of what you will need to get up-and-running with a simple chat app.
The next thing you might want to learn about is channel types. So far, we've been working with the 'messaging' channel type. However, if you want to implement a Twitch-style live chat, you can use a 'livestream' channel type. Other channel types include 'team' and 'commerce', and you can also create your own channel types. You can go [here](https://getstream.io/chat/docs/node/channel_features/?language=javascript) for more information.

The difference between these channel types is their default user permissions. For example, in a 'messaging' style channel, a user with the role 'guest' is unable to 'read' a channel, but in a livestream style chat, a guest is allowed read the channel. For a more complete list of default permissions, refer to [this page](https://getstream.io/chat/docs/node/channel_permission_policies/?language=javascript) in the docs.

All of these user permissions are fully customizable, and you can access these permissions in your dashboard.
If you go to your dashboard, click on your app, then on Chat > Overview, you will see the full list of permissions in a JSON file at the bottom of the page.
In addition to the permissions, you are provided with lots of other options. A commonly used option is to enable the blocklist, which will block messages that contain profanity.



