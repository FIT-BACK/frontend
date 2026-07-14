import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupProfilePage() {
  const navigate = useNavigate();
  
  // 선택된 스타일 태그를 관리하는 상태입니다.
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['미니멀', '스트릿']);

  // 태그를 클릭하면 껐다 켰다 하는 함수입니다.
  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white px-8 py-10 font-sans">
      
      {/* 1. 상단 헤더 */}
      <div className="flex items-center mb-8 relative">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-xl">←</button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#352B6A]">프로필 설정</h1>
      </div>

      {/* 2. 진행 상태 바 (3단계 중 2단계까지 보라색) */}
      <div className="flex gap-2 mb-12">
        <div className="h-1.5 flex-1 bg-[#8B78FF] rounded-full"></div>
        <div className="h-1.5 flex-1 bg-[#8B78FF] rounded-full"></div>
        <div className="h-1.5 flex-1 bg-[#E5E5EA] rounded-full"></div>
      </div>

      {/* 3. 프로필 이미지 업로드 영역 */}
      <div className="flex justify-center mb-10">
        <div className="relative w-[110px] h-[110px]">
          {/* 기본 프로필 원형 */}
          <div className="w-full h-full bg-[#F4F4F8] rounded-full flex justify-center items-center border border-[#E5E5EA]">
            <span className="text-[40px] opacity-30">👤</span>
          </div>
          {/* 플러스 버튼 */}
          <button className="absolute right-0 bottom-0 w-8 h-8 bg-[#8B78FF] text-white rounded-full flex justify-center items-center text-xl font-bold border-2 border-white shadow-md">
            +
          </button>
        </div>
      </div>

      {/* 4. 입력 폼 영역 */}
      <div className="flex flex-col gap-10">
        {/* 닉네임 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#352B6A]">닉네임</label>
          <input 
            type="text" 
            placeholder="다른 유저에게 보일 이름" 
            className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
          />
        </div>

        {/* 관심 스타일 선택 */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-[#352B6A]">관심 스타일 (선택)</label>
          <div className="flex flex-wrap gap-2">
            {['미니멀', '스트릿', '아메카지', '캐주얼', '시크'].map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStyles.includes(style)
                    ? 'bg-[#EFEFFF] text-[#8B78FF] border border-[#8B78FF]'
                    : 'bg-[#F4F4F8] text-[#AEAEB2] border border-transparent'
                }`}
              >
                {style}
              </button>
            ))}
            <button className="px-4 py-2 rounded-full text-sm font-medium border border-dashed border-[#8B78FF] text-[#8B78FF] bg-white">
              + 추가
            </button>
          </div>
        </div>
      </div>

      {/* 5. 가입 완료 버튼 */}
      <div className="mt-auto pt-6">
        <button 
          onClick={() => alert('회원가입 완료! 🎉')}
          className="w-full bg-[#8B78FF] text-white py-4 rounded-xl text-base font-bold transition active:scale-95 shadow-md"
        >
          가입 완료
        </button>
      </div>

    </div>
  );
}