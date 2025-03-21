import { useState } from 'preact/hooks';

export default function Greeting({ messages }) {
  const [index, setIndex] = useState(0);

  const nextGreeting = () => {
    setIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  return (
    <div>
      <h3>{messages[index]}! Thank you for visiting!</h3>
      <button onClick={nextGreeting} className="btn">
        Change Greeting
      </button>
    </div>
  );
}
