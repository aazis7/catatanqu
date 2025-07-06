import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState({});

  const getMessage = async () => {
    fetch(`http://localhost:3000/api/message`)
      .then((res) => res.json())
      .then((message) => setMessage(message));
  };

  useEffect(() => {
    getMessage();
  }, []);
  return (
    <div>
      <ThemeToggle />
      <h1 className="font-bold text-5xl text-center tracking-tight scroll-m-20">
        API Says:
      </h1>
      <p>{JSON.stringify(message, null, 2)}</p>
    </div>
  );
}
