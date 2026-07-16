import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// 페이지 컴포넌트 임포트 (각 컴포넌트의 export 방식에 맞게 가져옵니다)
import {AiWaitingPage} from './pages/AiWaitingPage';
import {TagEditPage} from './pages/TagEditPage';
import { ResultReportPage } from './pages/ResultReportPage'; // ◀ 중괄호{} 확인!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold mt-10">홈 화면</h1>
              <p>실제 컨텐츠 표시</p>
            </div>
          } />
        </Route>

        {/*  SCR 06, 07, 08 (독립 경로) */}
        <Route path="/waiting" element={<AiWaitingPage />} />
        <Route path="/tag-edit" element={<TagEditPage />} />
        <Route path="/result" element={<ResultReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;