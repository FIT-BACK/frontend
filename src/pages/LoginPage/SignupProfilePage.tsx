import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/axiosInstance';

const STYLE_OPTIONS = ['캐주얼', '미니멀', '스트릿', '빈티지', '페미닌', '스포티', '포멀', '고프코어'];

export default function SignupProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { kakaoNickname, kakaoProfileImage } = location.state || {}; 

  const [nickname, setNickname] = useState(kakaoNickname || '');
  const [profileImage, setProfileImage] = useState<string | null>(kakaoProfileImage || null); 
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      if (selectedStyles.length >= 5) {
        alert('스타일은 최대 5개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // 프로필 동그라미를 클릭하면 숨겨진 파일 선택 창을 대신 클릭
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 유저가 이미지를 선택하면 화면에 미리보기를 띄워주기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

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
      
      navigate('/signup/complete', { 
        state: { nickname, selectedStyles },
        replace: true 
      });
 
    } catch (error) {
      console.error('온보딩 실패:', error);
      alert('프로필 설정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col px-8 py-10 font-sans shadow-lg relative overflow-y-auto">
        
        <div className="flex items-center mb-8 relative">
          <button onClick={() => navigate(-1)} className="text-text-tertiary text-xl">←</button>
          <h1 className="flex-1 text-center text-lg font-bold text-primary-900">프로필 설정</h1>
        </div>

        <div className="flex gap-2 mb-10">
          <div className="h-1.5 flex-1 bg-primary-400 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-primary-400 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-border rounded-full"></div>
        </div>

        {/* 프로필 이미지 영역 */}
        <div className="flex flex-col items-center mb-8">
          <div 
            className="relative w-[100px] h-[100px] cursor-pointer group"
            onClick={handleImageClick} 
            title="" 
          >
            {/* 실제 이미지가 들어가는 곳 (동그랗게 자르기) */}
            <div className="w-full h-full rounded-full bg-bg border-2 border-border flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">📷</span>
              )}
            </div>
            
            {/* + 버튼 */}
            <div className="absolute bottom-0 right-0 z-10 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm transition group-hover:scale-110">
              +
            </div>
          </div>
          <p className="mt-3 text-xs text-text-tertiary">프로필 사진을 등록해주세요</p>

          {/* 실제 사진 업로드 인풋 (화면에서는 숨김) */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* 닉네임 및 관심 스타일 영역 */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary-900">닉네임</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용하실 닉네임을 입력해주세요" 
              className="w-full bg-bg p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-primary-400"
              maxLength={10}
            />
            <p className="text-xs text-text-tertiary">최대 10자 이내로 입력해주세요.</p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-primary-900">관심 스타일 (최대 5개)</label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStyles.includes(style)
                      ? 'bg-primary-400 text-white border border-primary-400'
                      : 'bg-white text-text-secondary border border-border hover:bg-bg-secondary'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button 
            onClick={handleComplete}
            className={`w-full py-4 rounded-xl text-base font-bold transition shadow-md ${
              nickname.trim() && selectedStyles.length > 0 
                ? 'bg-primary-400 text-white active:scale-95' 
                : 'bg-border text-text-tertiary cursor-not-allowed'
            }`}
            disabled={!nickname.trim() || selectedStyles.length === 0}
          >
            가입 완료하고 시작하기
          </button>
        </div>

      </div>
    </div>
  );
}