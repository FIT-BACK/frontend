import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import BottomSheet from '../../components/common/BottomSheet';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [activeSheet, setActiveSheet] = useState<'email' | 'terms' | 'privacy' | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 약관 및 개인정보처리방침 데이터
  const termsText = (
    <>
      <strong>제1조 (목적)</strong>
      <br />
      본 약관은 FIT BACK(이하 "서비스")이 제공하는 AI 듀프 매칭 서비스의 이용 조건 및 절차에 관한 사항을 규정합니다.
      <br /><br />
      
      <strong>제2조 (서비스 이용)</strong>
      <br />
      서비스는 만 14세 이상의 회원에게 제공됩니다. 회원은 서비스를 이용하여 워너비 패션 이미지를 업로드하고 가성비 매칭 결과를 제공받을 수 있습니다.
      <br /><br />
      
      <strong>제3조 (금지 행위)</strong>
      <br />
      타인의 사진 무단 도용, 허위 정보 기재, 자동화 스크립트를 통한 대량 요청 등을 금지합니다.
      <br /><br />
      
      <strong>제4조 (서비스 변경·중단)</strong>
      <br />
      회사는 서비스 내용을 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.
      <br /><br />
      
      <strong>제5조 (면책)</strong>
      <br />
      AI 분석 결과는 참고용이며, 실제 상품 품질·적합성을 보증하지 않습니다.
    </>
  );

  const privacyText = (
    <>
      <strong>개인정보 수집 항목:</strong> 카카오톡 프로필 정보(닉네임, 프로필 사진)
      <br />
      <strong>수집 목적:</strong> 서비스 이용 및 본인 식별
      <br />
      <strong>보유 기간:</strong> 회원 탈퇴 시까지
    </>
  );

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

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    
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

        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-[340px] flex flex-col gap-4">
            <button 
              onClick={handleKakaoLogin}
              className="w-full bg-[#FEE500] text-[#371D1E] py-[18px] rounded-[14px] text-[16px] font-bold border-none transition active:scale-95 shadow-sm"
            >
              카카오로 시작하기
            </button>
            <button 
              onClick={() => setActiveSheet('email')}
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

          <p className="mt-4 text-[12px] text-text-tertiary text-center leading-relaxed">
            로그인 시{' '}
            <span 
              onClick={() => setActiveSheet('terms')} 
              className="text-primary-600 underline cursor-pointer hover:opacity-80"
            >
              이용약관
            </span>
            {' '}및{' '}
            <br />
            <span 
              onClick={() => setActiveSheet('privacy')} 
              className="text-primary-600 underline cursor-pointer hover:opacity-80"
            >
              개인정보처리방침
            </span>
            에 동의합니다
          </p>
        </div>
      </div>

      {/* 이메일 로그인 바텀시트 */}
      {activeSheet === 'email' && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 transition-opacity"
          onClick={() => setActiveSheet(null)}
        >
          <div 
            className="w-full max-w-[480px] bg-white rounded-t-2xl p-8 pb-12 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 및 닫기 버튼 */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-primary-900">이메일 로그인</h2>
              <button 
                onClick={() => setActiveSheet(null)}
                className="text-text-tertiary text-2xl p-2 hover:text-text-secondary transition"
              >
                ✕
              </button>
            </div>

            {/* 입력 폼 */}
            <div className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="이메일을 입력해주세요" 
                className="w-full p-4 border border-border rounded-[14px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="비밀번호를 입력해주세요" 
                className="w-full p-4 border border-border rounded-[14px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                onChange={(e) => setPassword(e.target.value)} 
              />
              
              <button 
                onClick={handleLogin}
                className="w-full mt-4 bg-primary-400 text-white py-[18px] rounded-[14px] text-[16px] font-bold transition active:scale-95"
              >
                로그인하기
              </button>
            </div>
            
            {/* 부가 기능 링크 */}
            <div className="flex justify-center gap-6 mt-6 text-[14px] text-text-tertiary">
              <button onClick={() => navigate('/find-password')} className="hover:text-primary-900 transition">
                비밀번호 찾기
              </button>
              <span className="text-border">|</span>
              <button onClick={() => navigate('/signup')} className="hover:text-primary-900 transition">이메일 가입</button>
            </div>
          </div>
        </div>
      )}

      {/* 기존 약관/개인정보 바텀시트 */}
      <BottomSheet 
        isOpen={activeSheet === 'terms'} 
        onClose={() => setActiveSheet(null)} 
        title="이용약관"
        content={termsText}
      />

      <BottomSheet 
        isOpen={activeSheet === 'privacy'} 
        onClose={() => setActiveSheet(null)} 
        title="개인정보처리방침"
        content={privacyText}
      />
    </div>
  );
}