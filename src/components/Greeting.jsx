import { useState } from 'preact/hooks';

export default function Greeting({ messages }) {

  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];

  const [greeting, setGreeting] = useState(() => randomMessage());
  
  return (
    <div>
      <h3>{greeting}! Thank you for visiting!</h3>
      <button
        onClick={() => setGreeting(randomMessage())}
        style={{ cursor: 'pointer' }} // Makes the cursor a pointer on hover
      >
        New Greeting
      </button>
    </div>
  );
}
