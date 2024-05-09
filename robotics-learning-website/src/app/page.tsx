import Image from "next/image";
import { Database } from "./utils/database"

const db = new Database();

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1>Hello world</h1>
        <p>User 1: {db.getUsers()[0]?.username}</p>
      </div>
    </main>
  );
}
