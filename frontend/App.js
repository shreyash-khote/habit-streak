import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Keyboard, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
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
import { getHabits, createHabit } from './src/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState(0);
  const [activeHabit, setActiveHabit] = useState(null);

  const [habits, setHabits] = useState([]);

  useEffect(() => {
    async function loadHabits() {
      const data = await getHabits();
      setHabits(data);
    }
    loadHabits();
  }, []);

  const handleStartHabit = (habit) => {
    setActiveHabit(habit);
    setActiveTab('Focus');
    setCurrentScreen(1); // Timer screen
  };

  const handleCompleteHabit = (habitId) => {
    setHabits(habits.map(h => {
      if (h.id === habitId && !h.completed) {
        return { ...h, completed: true, subtitle: 'Completed', type: 'progress', progress: 1, streak: (h.streak || 0) + 1 };
      }
      return h;
    }));
    setActiveTab('Habits');
    setCurrentScreen(2);
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
        durationSeconds: durationSeconds > 0 ? durationSeconds : 1500,
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
      case 1: return <TimerScreen activeHabit={activeHabit} onCompleteHabit={handleCompleteHabit} />;
      case 2: return <HabitListScreen habits={habits} onStartHabit={handleStartHabit} />;
      case 3: return <ProgressDetailScreen habits={habits} onStartHabit={handleStartHabit} />;
      case 4: return <OverallProgressScreen />;
      case 5: return <AICoachScreen />;
      default: return <WelcomeScreen onAddHabit={handleAddHabit} habits={habits} />;
    }
  };

  return (
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
  );
}
