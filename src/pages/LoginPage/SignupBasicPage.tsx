import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axiosInstance'; 

export default function SignupBasicPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleNextStep = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await api.post('/api/v1/auth/sign', {
        email: email,
        password: password,
      });
      console.log('1단계 가입 성공:', response.data);
      navigate('/signup/profile'); 
    } catch (error) {
      console.error('가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex justify-center">
      
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col px-8 py-10 font-sans shadow-lg relative overflow-y-auto">
        
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#352B6A]">이메일</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com" 
              className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#352B6A]">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상 입력해주세요" 
              className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
            />
            <p className="text-xs text-[#AEAEB2]">영문, 숫자 포함 8자 이상</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#352B6A]">비밀번호 확인</label>
            <input 
              type="password" 
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 한번 더 입력해주세요" 
              className="w-full bg-[#F4F4F8] p-4 rounded-xl text-base outline-none focus:ring-2 focus:ring-[#8B78FF]"
            />
          </div>
        </div>

        {/* 4. 하단 버튼 */}
        <div className="mt-auto pt-6">
          <button 
            onClick={handleNextStep}
            className="w-full bg-[#8B78FF] text-white py-4 rounded-xl text-base font-bold transition active:scale-95 shadow-md"
          >
            다음 단계
          </button>
        </div>

      </div>
    </div>
  );
}