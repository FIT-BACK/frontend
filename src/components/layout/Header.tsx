// src/components/layout/Header.tsx
const Header = () => {
  return (
    <header className="h-16 w-full flex items-center justify-between px-4 border-b border-gray-200 bg-white">
      <div className="font-bold text-lg">FIT BACK</div>
      <button>
        {/* 알림 아이콘 */}
        <span>🔔</span>
      </button>
    </header>
  );
};

export default Header;