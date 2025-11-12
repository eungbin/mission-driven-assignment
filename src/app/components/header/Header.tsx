export default function Header() {
  return (
    <header>
      <div className="flex items-center justify-between px-4 py-4 relative min-h-[60px]">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-black font-medium text-lg">
          과제
        </h1>
        <button className="bg-gray-400 text-white px-5 py-2 rounded text-sm font-medium hover:bg-gray-500 transition-colors ml-auto">
          다음으로
        </button>
      </div>
      <div className="h-px bg-gray-300 w-full"></div>
    </header>
  );
}

