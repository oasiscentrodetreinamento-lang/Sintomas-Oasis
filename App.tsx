
import React, { useState } from 'react';
import Hero from './components/Hero';
import Registration from './components/Registration';
import Selection from './components/Selection';
import Assessment from './components/Assessment';
import Results from './components/Results';
import PainAssessment from './components/PainAssessment';
import PainResults from './components/PainResults';
import HistoryList from './components/HistoryList';
import { ViewState, StoredAnswer, UserProfile, HistoryEntry, PainMap, PainHistoryEntry } from './types';

// Storage key constant
const STORAGE_KEY = 'oasis_app_data_v1';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hero');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<StoredAnswer[]>([]);
  const [userHistory, setUserHistory] = useState<HistoryEntry[]>([]);
  const [currentPainMap, setCurrentPainMap] = useState<PainMap>({});
  const [painHistory, setPainHistory] = useState<PainHistoryEntry[]>([]);

  const saveToStorage = (profile: UserProfile, history: HistoryEntry[], pHistory?: PainHistoryEntry[]) => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      let allUsers = storedData ? JSON.parse(storedData) : [];
      if (!Array.isArray(allUsers)) allUsers = [];

      const userIndex = allUsers.findIndex((u: any) => u.email === profile.email);

      const userData = { ...profile, history, painHistory: pHistory || [] };

      if (userIndex >= 0) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...userData };
      } else {
        allUsers.push(userData);
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

  // 2. Register/Login -> Go to Selection
  const handleRegistration = (profile: UserProfile) => {
    setUserProfile(profile);
    
    // Load existing history if any (in case they register with existing email)
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const existingUser = Array.isArray(parsedData) 
          ? parsedData.find((u: any) => u.email === profile.email) 
          : null;

        if (existingUser) {
          setUserHistory(existingUser.history || []);
          setPainHistory(existingUser.painHistory || []);
        } else {
          setUserHistory([]);
          setPainHistory([]);
        }
      }
    } catch (e) {
      setUserHistory([]);
      setPainHistory([]);
    }

    // Go to Selection Screen instead of straight to assessment
    setView('selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search User -> Go to Selection
  const handleSearchUser = (email: string): boolean => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return false;

      const parsedData = JSON.parse(storedData);
      if (!Array.isArray(parsedData)) return false;

      const foundUser = parsedData.find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());

      if (foundUser) {
        setUserProfile({
          name: foundUser.name,
          email: foundUser.email,
          birthDate: foundUser.birthDate,
          gender: foundUser.gender
        });
        
        setUserHistory(foundUser.history || []);
        setPainHistory(foundUser.painHistory || []);

        // Go to Selection Screen so trainer can choose what to do with this student
        setView('selection');
        return true;
      }
      return false;
    } catch (e) {
      console.error("Search error", e);
      return false;
    }
  };

  // Selection Handlers
  const handleSelectCurrent = () => {
    setView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNew = () => {
    // Start fresh
    setCurrentPainMap({});
    setView('pain-mapping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NEW: History Handlers
  const handleViewLastSymptomResult = () => {
    if (userHistory.length > 0) {
      const lastEntry = userHistory[userHistory.length - 1];
      setCurrentAnswers(lastEntry.answers);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewLastPainResult = () => {
    if (painHistory.length > 0) {
      const lastEntry = painHistory[painHistory.length - 1];
      setCurrentPainMap(lastEntry.painMap);
      setView('pain-results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewFullHistory = () => {
    setView('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSymptomResult = (index: number) => {
    if (userHistory[index]) {
      setCurrentAnswers(userHistory[index].answers);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPainResult = (index: number) => {
    if (painHistory[index]) {
      setCurrentPainMap(painHistory[index].painMap);
      setView('pain-results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToSelection = () => {
    setView('selection');
  };

  const handleBackToRegistration = () => {
    setView('registration');
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

    // Use functional update to ensure we have the latest history
    setUserHistory(prevHistory => {
      const updatedHistory = [...prevHistory, newEntry];
      
      // Save to storage immediately within logic flow to ensure consistency
      if (userProfile) {
        saveToStorage(userProfile, updatedHistory, painHistory);
      }
      
      return updatedHistory;
    });

    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPainMapFromResults = () => {
    setCurrentPainMap({}); // Reset map for new entry
    setView('pain-mapping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePainMap = (data: PainMap) => {
    setCurrentPainMap(data);
    
    // Calculate total score
    const totalScore = Object.values(data).reduce((acc, curr) => acc + curr.level, 0);

    const newEntry: PainHistoryEntry = {
      date: new Date().toISOString(),
      totalScore,
      painMap: data
    };

    setPainHistory(prev => {
      const updatedHistory = [...prev, newEntry];
      if (userProfile) {
         saveToStorage(userProfile, userHistory, updatedHistory);
      }
      return updatedHistory;
    });

    setView('pain-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelPainMap = () => {
    setView('selection');
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
          onSearch={handleSearchUser}
        />
      )}

      {view === 'selection' && userProfile && (
        <Selection 
          userProfile={userProfile}
          onSelectCurrent={handleSelectCurrent}
          onSelectNew={handleSelectNew}
          onBack={handleBackToRegistration}
          hasSymptomHistory={userHistory.length > 0}
          hasPainHistory={painHistory.length > 0}
          onViewLastSymptomResult={handleViewLastSymptomResult}
          onViewLastPainResult={handleViewLastPainResult}
          onViewFullHistory={handleViewFullHistory}
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
          onStartPainMap={handleStartPainMapFromResults}
          onBackToMenu={handleBackToSelection}
        />
      )}

      {view === 'pain-mapping' && userProfile && (
        <PainAssessment 
          userProfile={userProfile}
          onSave={handleSavePainMap}
          onCancel={handleCancelPainMap}
        />
      )}

      {view === 'pain-results' && userProfile && (
        <PainResults 
          currentMap={currentPainMap}
          history={painHistory}
          userProfile={userProfile}
          onBack={() => setView('selection')}
        />
      )}

      {view === 'history' && userProfile && (
        <HistoryList
          userProfile={userProfile}
          symptomHistory={userHistory}
          painHistory={painHistory}
          onBack={handleBackToSelection}
          onSelectSymptomResult={handleSelectSymptomResult}
          onSelectPainResult={handleSelectPainResult}
        />
      )}
    </div>
  );
};

export default App;
