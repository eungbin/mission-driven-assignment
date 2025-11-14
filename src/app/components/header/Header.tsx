import Button from "../common/Button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-6xl mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between py-4 relative min-h-[60px]">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-black font-medium text-lg">
            과제
          </h1>
          <Button variant="light-gray" size="small" className="hidden md:block ml-auto w-30">
            다음으로
          </Button>
        </div>
      </div>
      <div className="h-px bg-gray-300 w-full"></div>
    </header>
  );
}

