##Set Up Environment##
1. Install Stream npm install stream-chat or yarn add stream-chat.
2. Import StreamChat into your project 
`
import { StreamChat } from 'stream-chat'  
//or 
const StreamChat = require('stream-chat').StreamChat;
`
3. Head to your dashboard and get your App ID and Secret to store in an .env file. 

4. We will need to create two instances of StreamChat, one on the client-side and one on the server-side. While the majority of your app will interact with Streams API client side, there are a few things that are required to occur server-side for security purposes, such as generating user tokens and updating user roles/permissions. [Here] is a link with more info on how the server/client side connect. 
Create a client-side chat instance. This can be used to log in/log out users, retrieve user info, get channels, and more. 
`const client = StreamChat.getInstance(YOUR_APP_KEY);`
In a separate file, create a server-side chat instance. This can be used to create users, and generate tokens, among other things.
`const serverClient = StreamChat.getInstance(YOUR_APP_KEY, YOUR_APP_SECRET);`

((link to express server in repo?))
##Create Users & Login##

1. You can add a user by running the upsertUser() method, or multiple users by running upsertUsers(). Let’s go to our server-side file and add a few people to our chat app!
 
`const userArray = [
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
`

Now if you look in the Chat Explorer of your Dashboard, you can see all of your new users. 
 
 
2. Now that you’ve created your list of users, it’s time to log yourself in. To do this, you need to generate a user token. On your server-side, run `serverClient.createToken(your_name)`
It’s encouraged to read [this](https://getstream.zendesk.com/hc/en-us/articles/360060576774-Token-Creation-Best-Practices) article on best practices for token creation. 
 
 
3. You can log in by taking your server-side generated token and running `client.connectUser({ id: your_name }, your_token)`
Note how you do not have to run `upsertUser` to add a user to a database, but it is an option if you want to add a user or multiple users without having them actually connect, as running `connectUser` can impact your MAUs.
((link to part of repo where we pass token from server to client side))


##Pick A User to Chat With##
1. Let’s pick a friend to chat with. You can create a 1-on-1 chat channel as simply as running `client.channel()` and passing in a channel type and an object with an array of members, then running the `create` method.
`const channel = client.channel('messaging', {
 members: [chatClient.user.id, 'Suki'],
})
 
await channel.create()`
*Note: In this instance we are leaving out an optional ‘id’ field as the second argument of .channel(). This field can be used to create a custom channel name, but for 1 on 1 instances it's best practice to have the API autogenerate a channel id.*

You can also add custom parameters to this channel if you'd like, for example:
`
const channel = client.channel('messaging', {
 members: [chatClient.user.id, 'Suki'],
 customParameter: 'hello world'
})
`

##Send A Message##

Now that we’ve created our channel, we can access that channel instance and run its sendMessage() function. To access the channel and its methods, you need the channel ID, which you can get
from the response of channel.create() `response.channel.id`.  

Once you’ve gotten your channel id you can use the `sendMessage()` method. 
`
const channel = client.channel('messaging', {
 members: [chatClient.user.id, 'Suki']
})
 
await channel.create()

channel.sendMessage({ text: "Hi Friend!" })
`

// Next steps, show how to run client.channel() for a different user. It seems like we could use the same function written above, because even if we created a channel
// with a different user, then switched back to Suki, it would return the originally created channel, which would allow us to not have to run queryChannels.
// We may want to include a step before this point that queries Users

