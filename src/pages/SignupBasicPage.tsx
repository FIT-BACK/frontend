import { useNavigate } from 'react-router-dom';

export default function SignupBasicPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white px-8 py-10 font-sans">
      
      {/* 1. 상단 헤더 */}
      <div className="flex items-center mb-8 relative">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-xl">←</button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#352B6A]">회원가입</h1>
      </div>

      {/* 2. 진행 상태 바 */}
      <div className="flex gap-2 mb-10">
        <div className="h-1.5 flex-1 bg-[#8B78FF] rounded-full"></div>
        <div className="h-1.5 flex-1 bg-[#E5E5EA] rounded-full"></div>
        <div className="h-1.5 flex-1 bg-[#E5E5EA] rounded-full"></div>
      </div>

      {/* 3. 입력 폼 영역 */}
      <div className="flex flex-col gap-6">
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#352B6A]">이메일</label>
          <input 
            type="email" 
            placeholder="example@email.com" 
            className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
          />
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#352B6A]">비밀번호</label>
          <input 
            type="password" 
            placeholder="8자 이상 입력해주세요" 
            className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
          />
          <p className="text-xs text-[#AEAEB2]">영문, 숫자 포함 8자 이상</p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#352B6A]">비밀번호 확인</label>
          <input 
            type="password" 
            placeholder="비밀번호를 한번 더 입력해주세요" 
            className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
          />
        </div>
      </div>

      {/* 4. 하단 버튼 */}
      <div className="mt-auto pt-6">
        <button 
          onClick={() => navigate('/profile')}
          className="w-full bg-[#8B78FF] text-white py-4 rounded-xl text-base font-bold transition active:scale-95 shadow-md"
        >
          다음 단계
        </button>
      </div>

    </div>
  );
}