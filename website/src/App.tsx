import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import Footer from './component/Footer';
import Header from './component/Header';

function App() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState<string>('en');
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  return (
    <>
      <Header lang={lang} setLang={setLang} />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
