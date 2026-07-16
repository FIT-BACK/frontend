import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

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
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App




=======
export default App;
>>>>>>> dev
