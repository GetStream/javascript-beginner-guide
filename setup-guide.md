## Set Up Environment ##
1. Install Stream npm install stream-chat or yarn add stream-chat.
2. Import StreamChat into your project 
```
import { StreamChat } from 'stream-chat'  
//or 
const StreamChat = require('stream-chat').StreamChat;
```
3. Head to your dashboard and get your App Key and Secret to store in an .env file. 

4. We will need to create two instances of StreamChat, one on the client-side and one on the server-side. While the majority of your app will interact with Streams API client side, there are a few things that are required to occur server-side for security purposes, such as generating user tokens and updating user roles/permissions. [Here] is a link with more info on how the server/client side connect. 
Create a client-side chat instance. This can be used to log in/log out users, retrieve user info, get channels, and more. 
`const client = StreamChat.getInstance(YOUR_APP_KEY);`
In a separate file, create a server-side chat instance. This can be used to create users, and generate tokens, among other things.
`const serverClient = StreamChat.getInstance(YOUR_APP_KEY, YOUR_APP_SECRET);`

((link to express server in repo?))
## Create Users & Login ##

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
 
 
2. Now that you’ve created your list of users, it’s time to log yourself in. To do this, you need to generate a user token. Your serverClient has a method built-in that generates a user token for you. On your server-side, run `serverClient.createToken(your_name)`
It’s encouraged to read [this](https://getstream.zendesk.com/hc/en-us/articles/360060576774-Token-Creation-Best-Practices) article on best practices for token creation. 
 
 
3. You can log in by taking your server-side generated token and running `client.connectUser({ id: your_name }, your_token)`

*If you run this method with a user that has not already been added using `upsertUser`, it will automatically upsert the user for you. `upsertUser` is useful if you want to add members to your application without actually connecting them with `connectUser` - which can increase your monthly MAUs. *
((link to part of repo where we pass token from server to client side?))


## Get User List ##
1. Before we start a chat with somebody, we need to see all of the users of our application, which we can do by running the `queryUsers` method. This method is quite flexible. You can use it to filter users by `id`, their `last_active` or `created_at` date, whether they are banned, and more. It also has a `limit` and `offset` option if you want to implement pagination. Refer to [this page](https://getstream.io/chat/docs/node/query_users/?language=javascript) in the docs for more info. 

For this 1-on-1 chat app, we are just going to query all users with a limit of 10 so we can get a list of users we can chat with, and sort it by the most recently created. 

*There are a lot of ways to query. You can query for channels, query for users, and members of channels. Learn more about query syntax [here](https://getstream.io/chat/docs/react/query_syntax/?language=js)*

```
const getUsers = async () => {
  const response = await chatClient.queryUsers({}, [{ created_at: -1 }], { limit: 10 })
  return response
  }
  
  getUsers()
```
((should we add the .then to this method to indicate they need to resolve the promise?)) 
The response of getUsers() will return a list of users.


## Create Chat Channel ##
Now that we have our list of users, we can create a 1-on-1 chat channel by running `client.channel()` and passing in a channel type and an object with an array of members, then running the `create` method.
Let's say we want to start a chat with Suki...
```const channel = client.channel('messaging', {
 members: [client.user.id, 'Suki'],
})
 
await channel.create()
```

((should we use this example using channel.watch instead?))


You can also add custom parameters to this channel if you'd like, for example:
```
const channel = client.channel('messaging', {
 members: [chatClient.user.id, 'Suki'],
 customParameter: 'hello world'
})
```


*In this example we are leaving out an optional ‘id’ field as the second argument of .channel(). This field can be used to create a custom channel name, but for 1 on 1 instances it's best practice to have the API autogenerate a channel id.*

*Another option is to run `channel.watch()` instead of `channel.create()`. Running `channel.watch()` will not only create the channel if it doesn't exist yet, but it will also tell the server to listen for any events that occur in a channel, such as when a new message is sent. More info on watching channels [here](https://getstream.io/chat/docs/node/watch_channel/?language=javascript)*

*If you have already created this channel before, you don't need to do this step and can just get the channel instance, which is covered in the following step.*


## Send A Message ##

Now that we’ve created our channel, we can access that channel instance and run its sendMessage() method. A channel instance also includes lots of other useful information, such as the `created_by` field, and `member_count`. 


To access the channel instance and its methods, you need the channelID, which you can get from the `queryChannels()` method. `queryChannels` will return channel state and automatically watch the channel. 
((should we offer the option of getting the channel id from channel.create or .watch? is this a good practice??))

```
//create a filter that checks for yourself (client.userID) and one other user (userID)
  const filter = {type: "messaging", members: { $eq: [client.userID, userID] }}
//supply this filter to queryChannels()
  const channels = await client.queryChannels(filter)
//queryChannels returns an array, get the id from the returned channel
  const channelID = channels[0]?.id
//create the channel instance by supplying client.channel() with the channel type and the channelID.
  const channel = client.channel('messaging', channelID)
}
```
Once you’ve gotten your channel instance you can use the `sendMessage()` method. 
```
channel.sendMessage({ text: "Hi Friend!" })
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
