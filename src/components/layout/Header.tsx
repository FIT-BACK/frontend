const Header = () => {
  return (
    <header className="h-16 w-full flex items-center justify-between px-4 border-b border-primary-200 bg-white">
      <div className="font-bold text-lg text-primary-900">FIT BACK</div>
      <button className="text-text-secondary">
        {/* 알림 아이콘 */}
        <span>🔔</span>
      </button>
    </header>
  );
};

export default Header;