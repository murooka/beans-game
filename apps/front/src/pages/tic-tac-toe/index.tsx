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
        <li>ルームを作成</li>
        <li>ルームに参加</li>
      </ul>
    </div>
  );
}
