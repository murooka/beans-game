import Link from "next/link";

export default function TicTacToeIndex() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/tic-tac-toe/local">
            <a>ローカルプレイ</a>
          </Link>
        </li>
        <li>
          <Link href="/tic-tac-toe/solo">
            <a>ソロプレイ</a>
          </Link>
        </li>
        <li>
          <Link href="/tic-tac-toe/rooms/new">
            <a>ルームを作成</a>
          </Link>
        </li>
        <li>ルームに参加</li>
      </ul>
    </div>
  );
}
