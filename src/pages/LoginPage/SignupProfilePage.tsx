import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axiosInstance';

// 관심 스타일 목록
const STYLE_OPTIONS = ['캐주얼', '미니멀', '스트릿', '빈티지', '페미닌', '스포티', '포멀', '고프코어'];

export default function SignupProfilePage() {
  const navigate = useNavigate();

  // 1. 사용자 입력 상태 관리
  const [nickname, setNickname] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // 2. 스타일 다중 선택/해제 로직
  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      if (selectedStyles.length >= 3) {
        alert('스타일은 최대 3개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // 3. '완료' 버튼 클릭 시 실행될 API 호출 함수
  const handleComplete = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (selectedStyles.length === 0) {
      alert('관심 스타일을 1개 이상 선택해주세요.');
      return;
    }

    try {
      const response = await api.put('/api/v1/members/me/onboarding', {
        nickname: nickname,
        preferredStyles: selectedStyles,
      });

      console.log('2단계(온보딩) 가입 성공:', response.data);
      alert('환영합니다! 가입이 완료되었습니다.');
      navigate('/'); 

    } catch (error) {
      console.error('온보딩 실패:', error);
      alert('프로필 설정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col px-8 py-10 font-sans shadow-lg relative overflow-y-auto">
        
        {/* 상단 헤더 */}
        <div className="flex items-center mb-8 relative">
          <button onClick={() => navigate(-1)} className="text-gray-400 text-xl">←</button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#352B6A]">프로필 설정</h1>
        </div>

        {/* 진행 상태 바 */}
        <div className="flex gap-2 mb-10">
          <div className="h-1.5 flex-1 bg-[#8B78FF] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-[#8B78FF] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-[#E5E5EA] rounded-full"></div>
        </div>

        {/* 프로필 사진 영역 */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-[100px] h-[100px] rounded-full bg-[#F4F4F8] border-2 border-[#E5E5EA] flex items-center justify-center cursor-pointer">
            <span className="text-3xl">📷</span>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#8B78FF] rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
              +
            </div>
          </div>
          <p className="mt-3 text-xs text-[#AEAEB2]">프로필 사진을 등록해주세요</p>
        </div>

        {/* 입력 폼 영역 */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#352B6A]">닉네임</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용하실 닉네임을 입력해주세요" 
              className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
              maxLength={10}
            />
            <p className="text-xs text-[#AEAEB2]">최대 10자 이내로 입력해주세요.</p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-[#352B6A]">관심 스타일 (최대 3개)</label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStyles.includes(style)
                      ? 'bg-[#8B78FF] text-white border border-[#8B78FF]'
                      : 'bg-white text-[#8E8E93] border border-[#E5E5EA] hover:bg-[#F4F4F8]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-6">
          <button 
            onClick={handleComplete}
            className={`w-full py-4 rounded-xl text-base font-bold transition shadow-md ${
              nickname && selectedStyles.length > 0 
                ? 'bg-[#8B78FF] text-white active:scale-95' 
                : 'bg-[#E5E5EA] text-[#AEAEB2] cursor-not-allowed'
            }`}
            disabled={!nickname || selectedStyles.length > 0 ? false : true}
          >
            가입 완료하고 시작하기
          </button>
        </div>

      </div>
    </div>
  );
}