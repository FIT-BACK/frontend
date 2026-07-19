import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupBasicPage from './pages/LoginPage/SignupBasicPage';
import SignupProfilePage from './pages/LoginPage/SignupProfilePage';
import KakaoCallback from './pages/LoginPage/KakaoCallback'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold mt-10">홈 화면</h1>
              <p>실제 컨텐츠 표시</p>
            </div>
          } />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupBasicPage />} />
        <Route path="/signup/basic" element={<SignupBasicPage />} />
        <Route path="/signup/profile" element={<SignupProfilePage />} />
        
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;