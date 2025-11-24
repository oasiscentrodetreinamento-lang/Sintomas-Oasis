
import React, { useState } from 'react';
import Hero from './components/Hero';
import Registration from './components/Registration';
import Assessment from './components/Assessment';
import Results from './components/Results';
import { ViewState, StoredAnswer, UserProfile, HistoryEntry } from './types';

// Storage key constant
const STORAGE_KEY = 'oasis_app_data_v1';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hero');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<StoredAnswer[]>([]);
  const [userHistory, setUserHistory] = useState<HistoryEntry[]>([]);

  const saveToStorage = (profile: UserProfile, history: HistoryEntry[]) => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      let allUsers = storedData ? JSON.parse(storedData) : [];
      if (!Array.isArray(allUsers)) allUsers = [];

      const userIndex = allUsers.findIndex((u: any) => u.email === profile.email);

      if (userIndex >= 0) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...profile, history };
      } else {
        allUsers.push({ ...profile, history });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
    } catch (e) {
      console.error("Error saving data", e);
    }
  };

  // 1. Start -> Go to Registration
  const startFlow = () => {
    setView('registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Register/Login -> Go to Assessment
  const handleRegistration = (profile: UserProfile) => {
    setUserProfile(profile);
    
    // Load existing history
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const existingUser = Array.isArray(parsedData) 
          ? parsedData.find((u: any) => u.email === profile.email) 
          : null;

        if (existingUser && existingUser.history) {
          setUserHistory(existingUser.history);
        } else {
          setUserHistory([]);
        }
      }
    } catch (e) {
      setUserHistory([]);
    }

    setView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelRegistration = () => {
    setView('hero');
  };

  // 3. Complete Assessment
  const handleAssessmentComplete = (answers: StoredAnswer[]) => {
    setCurrentAnswers(answers);
    
    let totalScore = 0;
    let maxScore = 0;
    answers.forEach(ans => {
      totalScore += ans.score;
      maxScore += 3;
    });
    
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const newEntry: HistoryEntry = {
      date: new Date().toISOString(),
      totalScore,
      maxScore,
      percentage,
      answers
    };

    const updatedHistory = [...userHistory, newEntry];
    setUserHistory(updatedHistory);
    
    if (userProfile) {
      saveToStorage(userProfile, updatedHistory);
    }

    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-200 antialiased selection:bg-brand selection:text-white">
      {view === 'hero' && (
        <Hero onStart={startFlow} />
      )}
      
      {view === 'registration' && (
        <Registration 
          onRegister={handleRegistration} 
          onCancel={handleCancelRegistration} 
        />
      )}
      
      {view === 'assessment' && (
        <Assessment onComplete={handleAssessmentComplete} />
      )}
      
      {view === 'results' && userProfile && (
        <Results 
          answers={currentAnswers} 
          history={userHistory}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default App;
