import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex justify-center">
      
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col items-center justify-center px-8 font-sans shadow-lg relative overflow-y-auto">
        
        {/* 로고 아이콘 박스 */}
        <div className="w-[100px] h-[100px] bg-[#A094F0] rounded-[24px] flex justify-center items-center mb-6 shadow-sm">
          <span className="text-[48px]">🧥</span>
        </div>
        
        {/* 서비스 이름 및 설명 */}
        <h1 className="text-[28px] font-black text-[#352B6A] mb-3 tracking-tighter">
          FIT BACK
        </h1>
        <p className="text-[14px] text-[#8E8E93] mb-[64px]">
          원하는 무드 그대로, 지갑에 딱 맞게
        </p>

        {/* 버튼 영역 */}
        <div className="w-full max-w-[340px] flex flex-col gap-4">
          <div className="w-full">
            <button className="w-full bg-[#FEE500] text-[#371D1E] py-[18px] rounded-[14px] text-[16px] font-bold border-none transition active:scale-95 shadow-sm">
              카카오로 시작하기
            </button>
          </div>
          
          <div className="w-full">
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-[#F4F4F8] text-[#333333] border-none py-[18px] rounded-[14px] text-[16px] font-semibold transition active:scale-95"
            >
              이메일로 로그인
            </button>
          </div>
        </div>

        {/* 이용약관 텍스트 */}
        <p className="mt-[40px] text-[12px] text-[#AEAEB2]">
          로그인 시 이용약관에 동의합니다
        </p>

      </div>
    </div>
  );
}