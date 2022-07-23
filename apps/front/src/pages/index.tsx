import Link from "next/link";

export default function Index() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/tic-tac-toe">
            <a>◯×ゲーム</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
