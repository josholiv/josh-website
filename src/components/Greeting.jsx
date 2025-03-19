import { useState } from 'preact/hooks';

export default function Greeting({messages}) {

  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];

  const [greeting, setGreeting] = useState(() => randomMessage());
  
  return (
    <div>
      <h3>{greeting}! Thank you for visiting!</h3>
      <button onClick={() => setGreeting(randomMessage())}>
      style={{ fontSize: "0.5rem", cursor: "pointer" }}
        New Greeting
      </button>
    </div>
  );
}