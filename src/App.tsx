import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

import { AiWaitingPage } from './pages/AiWaitingPage';
import { TagEditPage } from './pages/TagEditPage';
import { ResultReportPage } from './pages/ResultReportPage';
import HomePage from './pages/HomePage';
import ImageUploadPage from './pages/ImageUploadPage';

function AppMain() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route
          index
          element={<HomePage onOpenUploadSheet={() => navigate('/upload')} />}
        />
      </Route>

      <Route
        path='/upload'
        element={
          <ImageUploadPage
            onBack={() => navigate('/')}
            onStartAnalysis={() => navigate('/waiting')}
          />
        }
      />

      <Route path='/waiting' element={<AiWaitingPage />} />
      <Route path='/tag-edit' element={<TagEditPage />} />
      <Route path='/result' element={<ResultReportPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppMain />
    </BrowserRouter>
  );
}

export default App;
