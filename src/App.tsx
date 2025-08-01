import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import Dictionnaire from './pages/Dictionnaire';
import Conjugaison from './pages/Conjugaison';
import Traduction from './pages/Traduction';
import Prononciation from './pages/Prononciation';
import ReconnaissanceVocale from './pages/ReconnaissanceVocale';
import Grammaire from './pages/Grammaire';
import Recherche from './pages/Recherche';
import Favoris from './pages/Favoris';
import Messagerie from './pages/Messagerie';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import HistoireRusse from './pages/HistoireRusse';
import CoursActualite from './pages/CoursActualite';
import RadioRusse from './pages/RadioRusse';
import RadioPlayer from './components/RadioPlayer';
import PresentationCours from './pages/PresentationCours';
import CoursePlayer from './pages/CoursePlayer';
import CompleterProfil from './pages/CompleterProfil';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import News from './pages/News';
import TDAH from './pages/TDAH';
import Tools from './pages/Tools';
import Layout from './components/Layout/Layout';
// import LoginForm from './components/Auth/LoginForm';
// import RegisterForm from './components/Auth/RegisterForm';

import AppInactivity from './components/AppInactivity.tsx';
import CookieConsent from './components/CookieConsent';
// Bandeau RGPD
<CookieConsent />
import LivePage from './pages/LivePage';
import NewCommunity from './pages/NewCommunity';
import Community from './pages/Community';
import Home from './pages/Home';
import ScreenshotDetail from './pages/ScreenshotDetail';
import StepikExplorer from './pages/StepikExplorer';


function DiscoverToolsButton() {
  const navigate = useNavigate();
  return (
    <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-base" onClick={() => navigate('/tools')}>
      Découvrir les outils
    </button>
  );
}

function ResourcesPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ressources</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Accédez à des fiches de vocabulaire, des podcasts, des vidéos et des outils pour progresser plus vite.</p>
      <DiscoverToolsButton />
    </div>
  );
}



const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/histoire-russe" element={<HistoireRusse />} />
    <Route path="/cours-actualite" element={<CoursActualite />} />
    <Route path="/radio-russe" element={<RadioRusse />} />
    <Route path="/tdah" element={<TDAH />} />
    <Route path="/news" element={<Layout />}>
      <Route index element={<News />} />
    </Route>
    <Route path="/presentation-cours" element={<PresentationCours />} />
    <Route path="/completer-profil" element={<CompleterProfil />} />
    <Route path="/course-player/:courseId" element={<CoursePlayer />} />
    <Route path="/dashboard" element={<Layout />}>
      <Route index element={<Dashboard />} />
    </Route>
    <Route path="/courses" element={<Layout />}>
      <Route index element={<Courses />} />
    </Route>
    <Route path="/exercises" element={<Layout />}>
      <Route index element={
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Exercices interactifs</h1>
          <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-base">Lancer un exercice aléatoire</button>
        </div>
      } />
    </Route>
    <Route path="/messagerie" element={<Layout />}>
      <Route index element={<Messagerie />} />
    </Route>
    <Route path="/chat" element={<Layout />}>
      <Route index element={
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Messagerie instantanée</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Discutez en temps réel avec d’autres membres, posez vos questions ou trouvez un binôme pour pratiquer !</p>
          <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-base">Ouvrir le chat</button>
        </div>
      } />
    </Route>
    <Route path="/achievements" element={<Layout />}>
      <Route index element={
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Réalisations & Badges</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Débloquez des badges, suivez vos records et collectionnez vos trophées pour rester motivé !</p>
          <button className="px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors shadow-lg text-base">Voir mes badges</button>
        </div>
      } />
    </Route>
    <Route path="/resources" element={<Layout />}>
      <Route index element={<ResourcesPage />} />
    </Route>
    <Route path="/tools" element={<Layout />}>
      <Route index element={<Tools />} />
    </Route>
    <Route path="/profile" element={<Layout />}>
      <Route index element={<Profile />} />
    </Route>
    <Route path="/settings" element={<Layout />}>
      <Route index element={<Settings />} />
    </Route>
    <Route path="/dictionnaire" element={<Dictionnaire />} />
    <Route path="/conjugaison" element={<Conjugaison />} />
    <Route path="/traduction" element={<Traduction />} />
    <Route path="/prononciation" element={<Prononciation />} />
    <Route path="/reconnaissance-vocale" element={<ReconnaissanceVocale />} />
    <Route path="/grammaire" element={<Grammaire />} />
    <Route path="/recherche" element={<Recherche />} />
    <Route path="/favoris" element={<Favoris />} />
    <Route path="/community" element={<Layout />}>
      <Route index element={<Community />} />
    </Route>
    <Route path="/live" element={<Layout />}>
      <Route index element={<LivePage />} />
    </Route>
    <Route path="/new-community" element={<Layout />}>
      <Route index element={<NewCommunity />} />
    </Route>
    <Route path="/screenshot/:id" element={<ScreenshotDetail />} />
    <Route path="/stepik-explorer" element={<StepikExplorer />} />
    {/* Fallback absolu : affiche Home pour toute route inconnue */}
    <Route path="*" element={<Home />} />
  </Routes>
);

const App: React.FC = () => (
  <Router>
    <ThemeProvider>
      <AuthProvider>
        <HelmetProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <AppInactivity />
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)'
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF'
                  }
                }
              }}
            />
            <RadioPlayer />

          </div>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router>
);

export default App;