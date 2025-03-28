import { useState, useEffect } from 'preact/hooks';

export default function Greeting({ messages }) {
  const [index, setIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFadingOut(true); // Start fading out
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % messages.length); // Change the message
        setIsFadingOut(false); // Start fading in
      }, 1000); // Wait for 1 second (fade duration) before changing the message
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [messages.length]);

  return (
    <div>
      <h3 className={`fade ${isFadingOut ? 'fade-out' : 'fade-in'}`} style={{ display: 'inline' }}>
        {messages[index]}
      </h3>
      <h3 style={{ display: 'inline' }}> Thank you for visiting!</h3>
    </div>
  );
}
