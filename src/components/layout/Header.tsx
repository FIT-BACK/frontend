const Header = () => {
  return (
    <header className="h-16 w-full flex items-center justify-between px-4 border-b border-primary-200 bg-white">
      <div className="font-bold text-lg text-primary-900">FIT BACK</div>
      <button className="relative text-text-secondary">
        {/* 알림 아이콘 — 안 읽은 알림 뱃지는 알림 목록 기능(PR #28) 머지 후 실제 데이터로 연결 예정 */}
        <span>🔔</span>
        <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-error-400 border border-white" />
      </button>
    </header>
  );
};

export default Header;