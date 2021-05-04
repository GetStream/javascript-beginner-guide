# Example Chat App using the JS SDK for [Stream Chat](https://getstream.io/chat/)

<p align="center">
  <a href="https://getstream.io/chat/react-chat/tutorial/"><img src="https://i.imgur.com/SRkDlFX.png" alt="react native chat" width="60%" /></a>
</p>

**Quick Links**

- Follow along in this complimentary [Guide](https://github.com/zacheryconverse/basic-chat/blob/main/setup-guide.md)
- [Register](https://getstream.io/chat/trial/) to get an API key for Stream Chat
- [JS Chat API docs](https://getstream.io/chat/docs/js/)
- [Knowledge Base Articles](https://getstream.zendesk.com/hc/en-us/)

**Use**
This is a simple example chat app and guide to using `stream-chat` - the JS SDK for Stream Chat.\
The purpose of this repo is to showcase Stream Chat basic concepts, use, and best practices.

## Install Example App

To try out this example chat app, follow these steps:

1. Clone repo and install dependencies - Run:
```
git clone https://github.com/zacheryconverse/basic-chat.git
npm install
```

2. Create a .env file at root level and another in the server folder
3. Create an account on [Stream](https://getstream.io/try-for-free/). Get Started for Free with an Unlimited 30-Day Chat Messaging Trial.
4. Go to your Stream [Dashboard](https://dashboard.getstream.io/dashboard/v2/)
5. Add your app key to the root .env file you created:
```javascript
REACT_APP_KEY=your-app-key
```
6. Add your app key and secret to the .env file you created in the server folder:
```javascript
REACT_APP_KEY=your-app-key
REACT_APP_SECRET=your-app-secret
```
7. Add mock users (optional) - Run:
```
npm run upsertUsers
```
8. Start client and server - Run:
```
npm run dev
```
8. Navigate to http://localhost:3000/

## Docs

Review our [JS Chat API docs](https://getstream.io/chat/docs/js/).

## Knowledge Base

Review our [Knowledge Base Articles](https://getstream.zendesk.com/hc/en-us/).

## Typescript

**Note:** The [stream-chat-js](https://github.com/getstream/stream-chat-js) library allows for fully typed responses using generics.

## React UI Component SDK

If you would like to try pre-styled and fully featured React UI Components, use our [Official React SDK for Stream Chat](https://github.com/GetStream/stream-chat-react)

With Stream chat components, you can support any chat use case:

- Livestreams like Twitch or Youtube
- In-Game chat like Overwatch or Fortnite
- Team style chat like Slack
- Messaging style chat like Whatsapp or Facebook's messenger
- Commerce chat like Drift or Intercom

## React Chat Tutorial

The best place to start using the UI Components is the [React Chat SDK Tutorial](https://getstream.io/chat/react-chat/tutorial/). It teaches you how to use the React Chat SDK and also shows how to make frequently required changes.

## Free for Makers

Stream is free for most side and hobby projects. To qualify your project/company needs to have < 5 team members and < $10k in monthly revenue.
For complete pricing details visit our [Chat Pricing Page](https://getstream.io/chat/pricing/)

## We are hiring!
We've recently closed a [$38 million Series B funding round](https://techcrunch.com/2021/03/04/stream-raises-38m-as-its-chat-and-activity-feed-apis-power-communications-for-1b-users/) and we keep actively growing.
Our APIs are used by more than a billion end-users, and you'll have a chance to make a huge impact on the product within a team of the strongest engineers all over the world.

Check out our [current openings](https://getstream.io/team/#jobs) and apply via our [job board](https://grnh.se/cf33b7ba3us).
