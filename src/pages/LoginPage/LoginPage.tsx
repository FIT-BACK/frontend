import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [view, setView] = useState<'main' | 'email'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 이메일 로그인 처리 함수
  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      alert('로그인 실패: 이메일과 비밀번호를 확인해주세요.');
    }
  };

  // 카카오 로그인 처리 함수 (클릭 시 카카오 페이지로 이동)
  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    
    // 환경변수가 제대로 설정되지 않았을 때를 대비한 안전 장치
    if (!REST_API_KEY || !REDIRECT_URI) {
      alert('카카오 로그인 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      return;
    }

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col items-center justify-center px-8 font-sans shadow-lg relative overflow-y-auto">
        
        {view === 'email' && (
          <button 
            onClick={() => setView('main')}
            className="absolute top-8 left-8 text-text-tertiary text-xl"
          >
            ←
          </button>
        )}

        {/* 로고 영역 */}
        <div className="w-[100px] h-[100px] bg-primary-50 rounded-[24px] flex justify-center items-center mb-6 shadow-sm overflow-hidden">
          <img src="/logo.png" alt="FIT BACK 로고" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-[28px] font-black text-primary-900 mb-3 tracking-tighter">
          FIT BACK
        </h1>
        <p className="text-[14px] text-text-secondary mb-[64px]">
          원하는 무드 그대로, 지갑에 딱 맞게
        </p>

        <div className="w-full h-[300px] flex flex-col items-center">
          
          {/* 메인 화면 */}
          {view === 'main' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-[340px] flex flex-col gap-4">
                <button 
                  onClick={handleKakaoLogin}
                  className="w-full bg-[#FEE500] text-[#371D1E] py-[18px] rounded-[14px] text-[16px] font-bold border-none transition active:scale-95 shadow-sm"
                >
                  카카오로 시작하기
                </button>
                <button 
                  onClick={() => setView('email')}
                  className="w-full bg-bg-secondary text-text border-none py-[18px] rounded-[14px] text-[16px] font-semibold transition active:scale-95"
                >
                  이메일로 로그인
                </button>
              </div>

              <div className="mt-8 text-[14px] text-text-secondary">
                아직 계정이 없으신가요?{' '}
                <span 
                  onClick={() => navigate('/signup')}
                  className="text-primary-600 font-bold cursor-pointer hover:underline"
                >
                  회원가입
                </span>
              </div>

              <p className="mt-4 text-[12px] text-text-tertiary">
                로그인 시 이용약관에 동의합니다
              </p>
            </div>
          )}

          {/* 이메일 로그인 입력 화면 */}
          {view === 'email' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-[340px] flex flex-col gap-4 mb-8">
                <input 
                  type="email" 
                  placeholder="이메일" 
                  className="w-full p-4 border border-border rounded-[14px] outline-none focus:border-primary-400"
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                  type="password" 
                  placeholder="비밀번호" 
                  className="w-full p-4 border border-border rounded-[14px] outline-none focus:border-primary-400"
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div className="w-full max-w-[340px] flex flex-col gap-4">
                <button 
                  onClick={handleLogin}
                  className="w-full bg-primary-400 text-white py-[18px] rounded-[14px] text-[16px] font-bold transition active:scale-95"
                >
                  로그인하기
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
