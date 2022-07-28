import Link from "next/link";

export default function TicTacToeIndex() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/t3/local">
            <a>ローカルプレイ</a>
          </Link>
        </li>
        <li>
          <Link href="/t3/solo">
            <a>ソロプレイ</a>
          </Link>
        </li>
        <li>
          <Link href="/t3/rooms/new">
            <a>ルームを作成</a>
          </Link>
        </li>
        <li>ルームに参加</li>
      </ul>
    </div>
  );
}
