import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [view, setView] = useState<'main' | 'email'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col items-center justify-center px-8 font-sans shadow-lg relative overflow-y-auto">
        
        {/* 뒤로가기 버튼 */}
        {view === 'email' && (
          <button 
            onClick={() => setView('main')}
            className="absolute top-8 left-8 text-gray-400 text-xl"
          >
            ←
          </button>
        )}

        {/* =======================================
            [고정 영역] 
            로고, 타이틀, 서브타이틀까지 모두 조건문 밖으로 뺐습니다!
            ======================================= */}
        <div className="w-[100px] h-[100px] bg-[#A094F0] rounded-[24px] flex justify-center items-center mb-6 shadow-sm">
          <span className="text-[48px]">🧥</span>
        </div>
        <h1 className="text-[28px] font-black text-[#352B6A] mb-3 tracking-tighter">
          FIT BACK
        </h1>
        {/* 💡 요청하신 문구 고정 완료 */}
        <p className="text-[14px] text-[#8E8E93] mb-[64px]">
          원하는 무드 그대로, 지갑에 딱 맞게
        </p>

        {/* =======================================
            [가변 영역] 
            높이를 고정해두어 안의 내용이 바뀌어도 전체 화면이 덜컹거리지 않습니다.
            ======================================= */}
        <div className="w-full h-[300px] flex flex-col items-center">
          
          {/* === [메인 화면 내용] === */}
          {view === 'main' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-[340px] flex flex-col gap-4">
                <button className="w-full bg-[#FEE500] text-[#371D1E] py-[18px] rounded-[14px] text-[16px] font-bold border-none transition active:scale-95 shadow-sm">
                  카카오로 시작하기
                </button>
                <button 
                  onClick={() => setView('email')}
                  className="w-full bg-[#F4F4F8] text-[#333333] border-none py-[18px] rounded-[14px] text-[16px] font-semibold transition active:scale-95"
                >
                  이메일로 로그인
                </button>
              </div>

              <div className="mt-8 text-[14px] text-[#8E8E93]">
                아직 계정이 없으신가요?{' '}
                <span 
                  onClick={() => navigate('/signup')}
                  className="text-[#6C55EA] font-bold cursor-pointer hover:underline"
                >
                  회원가입
                </span>
              </div>

              <p className="mt-4 text-[12px] text-[#AEAEB2]">
                로그인 시 이용약관에 동의합니다
              </p>
            </div>
          )}

          {/* === [이메일 입력 화면 내용] === */}
          {view === 'email' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-[340px] flex flex-col gap-4 mb-8">
                <input 
                  type="email" 
                  placeholder="이메일" 
                  className="w-full p-4 border rounded-[14px] outline-none focus:border-[#A094F0]"
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                  type="password" 
                  placeholder="비밀번호" 
                  className="w-full p-4 border rounded-[14px] outline-none focus:border-[#A094F0]"
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div className="w-full max-w-[340px] flex flex-col gap-4">
                <button 
                  onClick={handleLogin}
                  className="w-full bg-[#A094F0] text-white py-[18px] rounded-[14px] text-[16px] font-bold transition active:scale-95"
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