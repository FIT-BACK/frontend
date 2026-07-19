import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axiosInstance'; 

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      api.post('/api/v1/auth/kakao', { 
        authorizationCode: code 
      })
      .then((res) => {
        const { accessToken, isNewMember } = res.data.data;
        
        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        
        // 신규 회원 여부에 따라 다른 화면으로 이동
        if (isNewMember) {
          alert('환영합니다! 프로필 설정을 진행해주세요.');
          navigate('/signup/profile'); 
        } else {
          alert('로그인 성공!');
          navigate('/'); 
        }
      })
      .catch((err) => {
        console.error('카카오 로그인 실패:', err);
        alert('카카오 로그인 중 오류가 발생했습니다.');
        navigate('/login');
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <p className="text-primary-900 font-bold text-lg">카카오 로그인 처리 중입니다... 🔄</p>
    </div>
  );
}
