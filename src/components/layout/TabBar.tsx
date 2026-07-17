import { Link, useLocation } from 'react-router-dom';

interface TabBarProps {
  onUploadClick?: () => void;
}

const TabBar = ({ onUploadClick }: TabBarProps) => {
  const location = useLocation();
  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  const tabClass = (path: string) =>
    `text-sm font-medium ${
      isActive(path) ? 'text-primary-600 font-bold' : 'text-text-secondary'
    }`;

  return (
    <nav className='h-16 w-full flex items-center justify-around border-t border-primary-200 bg-white'>
      <Link to='/' className={tabClass('/')}>
        홈
      </Link>
      <Link to='/closet' className={tabClass('/closet')}>
        클로젯
      </Link>

      {onUploadClick ? (
        <button
          type='button'
          onClick={onUploadClick}
          aria-label='이미지 업로드'
          className='bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg hover:bg-primary-800 transition-colors'
        >
          +
        </button>
      ) : (
        <Link
          to='/upload'
          className='bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg hover:bg-primary-800 transition-colors'
        >
          +
        </Link>
      )}

      <Link to='/saved' className={tabClass('/saved')}>
        저장
      </Link>
      <Link to='/mypage' className={tabClass('/mypage')}>
        마이
      </Link>
    </nav>
  );
};

export default TabBar;
