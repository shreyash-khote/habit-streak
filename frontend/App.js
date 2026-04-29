import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Keyboard, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

if (Platform.OS === 'web') {
  require('./assets/output.css');
}
import WelcomeScreen from './src/screens/WelcomeScreen';
import TimerScreen from './src/screens/TimerScreen';
import HabitListScreen from './src/screens/HabitListScreen';
import ProgressDetailScreen from './src/screens/ProgressDetailScreen';
import OverallProgressScreen from './src/screens/OverallProgressScreen';
import AICoachScreen from './src/screens/AICoachScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import { getHabits, createHabit, deleteHabit as apiDeleteHabit } from './src/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState(0);
  const [activeHabit, setActiveHabit] = useState(null);

  // ── Timer state lifted here so it survives tab switches ──
  const [timerTimeLeft, setTimerTimeLeft] = useState(0);
  const [timerTotalTime, setTimerTotalTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading
  const [isSignUpScreen, setIsSignUpScreen] = useState(false);

  const [habits, setHabits] = useState([]);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0); // bumped when a habit is completed

  useEffect(() => {
    // Listen to Firebase auth state — load habits only after auth is confirmed
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        // Now that we have a valid user, fetch their habits with a proper token
        const data = await getHabits();
        setHabits(data);
      } else {
        setIsLoggedIn(false);
        setHabits([]); // clear habits on sign-out
      }
    });

    return unsubscribe;
  }, []);

  const handleStartHabit = (habit) => {
    // Resolve the actual duration — never fall back to 25 min blindly
    const secs = habit.duration_seconds > 0
      ? habit.duration_seconds
      : habit.durationSeconds > 0
        ? habit.durationSeconds
        : 60; // 1-minute minimum if truly unset
    setActiveHabit(habit);
    setTimerTotalTime(secs);
    setTimerTimeLeft(secs);
    setTimerRunning(true);
    setActiveTab('Focus');
    setCurrentScreen(1);
  };

  const handleCompleteHabit = (habitId) => {
    setTimerRunning(false);
    setTimerTimeLeft(0);
    setHabits(habits.map(h => {
      if (h.id === habitId && !h.completed) {
        return { ...h, completed: true, subtitle: 'Completed', type: 'progress', progress: 1, streak: (h.streak || 0) + 1 };
      }
      return h;
    }));
    setStatsRefreshKey(k => k + 1); // trigger Stats tab to refetch
    setActiveTab('Habits');
    setCurrentScreen(2);
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await apiDeleteHabit(habitId);
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (error) {
      alert('Could not delete habit. Please try again.');
    }
  };

  /** Called from AICoachScreen when user taps '+ ADD' on a suggested habit */
  const handleAddHabitFromCoach = async (habitData) => {
    try {
      const newHabitData = {
        title: habitData.title,
        subtitle: 'Daily habit',
        start_time: '08:00 AM',
        streak: 0,
        icon: 'star',
        type: 'start',
        duration: 'Daily habit',
        duration_seconds: 1500,
        frequency_type: habitData.frequency_type || 'daily',
      };
      const savedHabit = await createHabit(newHabitData);
      setHabits((prev) => [...prev, savedHabit]);
    } catch (error) {
      console.error('Could not save AI habit:', error);
    }
  };

  const handleAddHabit = (newTitle, startTime, hours, minutes, seconds, frequencyData) => {
    if (!newTitle.trim()) return;
    
    let durationStr = '';
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const durationSeconds = (h * 3600) + (m * 60) + s;

    if (h > 0) durationStr += `${h}h `;
    if (m > 0) durationStr += `${m}m `;
    if (s > 0) durationStr += `${s}s`;
    
    durationStr = durationStr.trim() ? durationStr.trim() : 'Daily habit';

    const saveHabit = async () => {
      const newHabitData = {
        title: newTitle,
        subtitle: durationStr,
        start_time: startTime || '08:00 AM',
        streak: 0,
        icon: 'star',
        type: 'start',
        duration: durationStr,
        duration_seconds: durationSeconds > 0 ? durationSeconds : 1500,
        frequency_type: frequencyData?.frequency_type || 'daily',
        frequency_days: frequencyData?.frequency_days,
        frequency_dates: frequencyData?.frequency_dates
      };

      try {
        const savedHabit = await createHabit(newHabitData);
        setHabits([...habits, savedHabit]);
        setActiveTab('Habits');
        setCurrentScreen(2);
      } catch (error) {
        alert('Could not save habit to server. Please try again.');
      }
    };

    saveHabit();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0: return <WelcomeScreen onAddHabit={handleAddHabit} habits={habits} />;
      case 1: return (
        <TimerScreen
          activeHabit={activeHabit}
          onCompleteHabit={handleCompleteHabit}
          timeLeft={timerTimeLeft}
          setTimeLeft={setTimerTimeLeft}
          totalTime={timerTotalTime}
          setTotalTime={setTimerTotalTime}
          isRunning={timerRunning}
          setIsRunning={setTimerRunning}
        />
      );
      case 2: return <HabitListScreen habits={habits} onStartHabit={handleStartHabit} onDeleteHabit={handleDeleteHabit} />;
      case 3: return <ProgressDetailScreen habits={habits} onStartHabit={handleStartHabit} />;
      case 4: return <OverallProgressScreen habits={habits} statsRefreshKey={statsRefreshKey} />;
      case 5: return <AICoachScreen onAddHabit={handleAddHabitFromCoach} />;
      default: return <WelcomeScreen onAddHabit={handleAddHabit} habits={habits} />;
    }
  };

  if (isLoggedIn === null) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-[#FCF9F2] items-center justify-center">
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        {isSignUpScreen ? (
          <SignUpScreen 
            onSignUp={(user) => setIsLoggedIn(true)} 
            onNavigateToLogin={() => setIsSignUpScreen(false)} 
          />
        ) : (
          <LoginScreen 
            onLogin={(user) => setIsLoggedIn(true)} 
            onNavigateToSignUp={() => setIsSignUpScreen(true)} 
          />
        )}
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#FCF9F2]">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1">
          {renderScreen()}
        </View>

        {/* Bottom Navigation */}
        <View className="absolute bottom-0 w-full bg-nav flex-row justify-around pt-5 pb-9 z-50">
          {[
            {name: 'Home', icon: 'home', idx: 0},
            {name: 'Focus', icon: 'play-circle', idx: 1}, 
            {name: 'Habits', icon: 'list', idx: 2},
            {name: 'Progress', icon: 'pie-chart', idx: 3}, 
            {name: 'Stats', icon: 'bar-chart-2', idx: 4},
            {name: 'Coach', icon: 'cpu', idx: 5}
          ].map((tab) => {
            const isActive = activeTab === tab.name || currentScreen === tab.idx;
            return (
              <TouchableOpacity 
                key={tab.name}
                onPress={() => {
                  setActiveTab(tab.name);
                  setCurrentScreen(tab.idx);
                }} 
                className="items-center px-2"
              >
                <Feather 
                  name={tab.icon} 
                  size={22} 
                  color={isActive ? '#A04040' : '#8C7A6B'} 
                />
                <Text className={`text-[9px] ${isActive ? 'text-[#A04040] font-extrabold' : 'text-[#8C7A6B] font-semibold'} mt-1`}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
