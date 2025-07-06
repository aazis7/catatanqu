import { useLoaderData } from "react-router";

export default function Home() {
  const { message } = useLoaderData();
  return (
    <div>
      <h1>Hello, {message}</h1>
    </div>
  );
}
