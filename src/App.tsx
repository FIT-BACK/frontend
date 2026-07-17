import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupBasicPage from './pages/LoginPage/SignupBasicPage';
import SignupProfilePage from './pages/LoginPage/SignupProfilePage';

import {AiWaitingPage} from './pages/AiWaitingPage';
import {TagEditPage} from './pages/TagEditPage';
import { ResultReportPage } from './pages/ResultReportPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 네비게이션 바가 필요한 페이지들 */}
        <Route element={<Layout />}>
          <Route path="/" element={
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold mt-10">홈 화면</h1>
              <p>실제 컨텐츠 표시</p>
            </div>
          } />
        </Route>

        {/* 네비게이션 바가 필요 없는 페이지들 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupBasicPage />} />
        <Route path="/signup/basic" element={<SignupBasicPage />} />
        <Route path="/signup/profile" element={<SignupProfilePage />} />
        {/*  SCR 06, 07, 08 (독립 경로) */}
        <Route path="/waiting" element={<AiWaitingPage />} />
        <Route path="/tag-edit" element={<TagEditPage />} />
        <Route path="/result" element={<ResultReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;