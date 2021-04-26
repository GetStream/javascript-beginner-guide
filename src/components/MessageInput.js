import { useState, useEffect, Fragment } from 'react'

export default function MessageInput({ view, channel }) {
  const [message, setMessage] = useState('');

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    // channel.sendMessage({ text: message })
    // .then(() => setMessage(''))
    // .catch((err) => console.error(err));
    const destroy = await channel.delete();
    console.log(destroy, 'DESTROY');
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmitMessage}>
        <input
          value={message}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${view.split('-')[1]}`}
        />
      </form>
    </Fragment>
  )
}
