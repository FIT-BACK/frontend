import { Link } from 'react-router-dom';

const TabBar = () => {
  return (
    <nav className="h-16 w-full flex items-center justify-around border-t border-primary-200 bg-white">
      <Link to="/" className="text-text-secondary text-sm font-medium">
        홈
      </Link>
      <Link to="/closet" className="text-text-secondary text-sm font-medium">
        클로젯
      </Link>
      
      <Link 
        to="/upload" 
        className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg hover:bg-primary-800 transition-colors"
      >
        +
      </Link>
      
      <Link to="/saved" className="text-text-secondary text-sm font-medium">
        저장
      </Link>
      <Link to="/mypage" className="text-text-secondary text-sm font-medium">
        마이
      </Link>
    </nav>
  );
};

export default TabBar;