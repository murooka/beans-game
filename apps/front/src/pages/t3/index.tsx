import Link from "next/link";

import { SystemButton } from "../../components/SystemButton";

export default function TicTacToeIndex() {
  return (
    <div className="w-full h-screen">
      <ul className="w-full h-full flex flex-col justify-center items-center gap-y-4">
        <li className="w-48">
          <Link href="/t3/local">
            <a>
              <SystemButton className="w-full">ローカルプレイ</SystemButton>
            </a>
          </Link>
        </li>
        <li className="w-48">
          <Link href="/t3/solo">
            <a>
              <SystemButton className="w-full">ソロプレイ</SystemButton>
            </a>
          </Link>
        </li>
        <li className="w-48">
          <Link href="/t3/rooms/new">
            <a>
              <SystemButton className="w-full">部屋を作成</SystemButton>
            </a>
          </Link>
        </li>
        <li className="w-48">
          <SystemButton className="w-full">部屋に参加</SystemButton>
        </li>
      </ul>
    </div>
  );
}
