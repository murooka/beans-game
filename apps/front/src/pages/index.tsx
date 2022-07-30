import Link from "next/link";

export default function Index() {
  return (
    <div className="w-full h-screen">
      <ul className="w-full h-full flex justify-center items-center">
        <li>
          <Link href="/t3">
            <a>
              <div className="w-48 h-36 flex justify-center items-center border rounded hover:bg-gray-200">
                <span className="text-xl tracking-widest">◯×ゲーム</span>
              </div>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
