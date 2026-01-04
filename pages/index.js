// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Добро пожаловать на форум!</h1>
      <p>
        Перейти к <Link href="/forum"><a>форуму</a></Link>
      </p>
    </div>
  );
}
