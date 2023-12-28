import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../src/utils/i18n.ts';
import App from './App.tsx';
import './index.css';
import CoachesBio from './page/CoachesBio/index.tsx';
import Home from './page/Home/index.tsx';
import Privacy from './page/Privacy/index.tsx';
import SkillsTrainingClass from './page/SkillsTrainingClass/index.tsx';
import Teams from './page/Teams/index.tsx';
import Terms from './page/Terms/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='training' element={<SkillsTrainingClass />} />
        <Route path='teams' element={<Teams />} />
        <Route path='coaches' element={<CoachesBio />} />
        <Route path='terms' element={<Terms />} />
        <Route path='privacy' element={<Privacy />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
