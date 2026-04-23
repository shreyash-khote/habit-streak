import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

export default function TimerScreen({ activeHabit, onCompleteHabit }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeHabit) {
      const startSecs = activeHabit.duration_seconds || activeHabit.durationSeconds || 1500;
      setTimeLeft(startSecs);
      setTotalTime(startSecs);
      setIsRunning(true);
    } else {
      // Default sample time as seen in mockup
      setTimeLeft(15 * 60 + 30);
      setTotalTime(15 * 60 + 30);
      setIsRunning(false);
    }
  }, [activeHabit]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft <= 0) {
      setIsRunning(false);
      setShowCompletion(true);
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) : 0;
  const strokeDashoffset = circumference - (circumference * progressPercent);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayTime = formatTime(timeLeft);
  const displayTitle = activeHabit ? activeHabit.title : "Morning Routine";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
         contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} 
         className="flex-1 px-8 pt-10"
         showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-12">
          <View>
            <Text className="text-3xl font-extrabold text-textMain tracking-tight mb-1">Today's Focus</Text>
            <Text className="text-xs font-bold text-textMuted uppercase tracking-widest">Monday October 25, 2023</Text>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-[#F2EAE0]">
               <Feather name="search" size={20} color="#C2B8B2" />
            </TouchableOpacity>
            <View className="bg-[#FFF2E0] w-10 h-10 rounded-full items-center justify-center shadow-sm border border-[#FDE6C8]">
               <Text className="text-xl">🔥</Text>
            </View>
          </View>
        </View>

        {/* Goal Title */}
        <Text className="text-base font-extrabold text-textMain text-center mb-10 tracking-wide">{displayTitle}</Text>

        {/* Circular Timer UI */}
        <View className="items-center justify-center mb-12 relative">
          <Svg height="260" width="260" viewBox="0 0 240 240">
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#F2EAE0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#A04040"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              rotation="-90"
              origin="120, 120"
            />
          </Svg>
          <View className="absolute items-center justify-center">
             <Text className="text-5xl font-black text-textMain tracking-tighter">{displayTime}</Text>
          </View>
        </View>
        
        {/* Large Digital Display */}
        <Text className="text-4xl font-normal text-[#C2B8B2] text-center mb-12">{displayTime}</Text>

        {/* Controls */}
        <View className="flex-row justify-center space-x-4 mb-16">
          <TouchableOpacity 
            onPress={() => setIsRunning(true)}
            className="px-8 py-4 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30">
            <Text className="text-white text-xs font-black uppercase tracking-[2px]">Start</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsRunning(false)}
            className="px-8 py-4 rounded-full bg-[#8A3C3C] items-center justify-center shadow-md">
            <Text className="text-white text-xs font-black uppercase tracking-[2px]">Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setIsRunning(false);
              setTimeLeft(totalTime);
            }}
            className="px-8 py-4 rounded-full bg-[#D9CEBF] items-center justify-center shadow-sm">
            <Text className="text-white text-xs font-black uppercase tracking-[2px]">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Current Streak Footer */}
        <View className="flex-row justify-between items-end mt-auto pt-6 border-t border-[#F2EAE0]">
          <View>
            <Text className="text-base font-black text-textMain mb-1">Current Streak</Text>
            <Text className="text-sm text-primary font-black">🔥 5 days</Text>
          </View>
          <View className="w-14 h-14 bg-[#FFF2E0] rounded-full items-center justify-center shadow-sm border border-[#FDE6C8]">
             <Text className="text-3xl">🔥</Text>
          </View>
        </View>
      </ScrollView>

      {/* Completion Modal */}
      <Modal transparent visible={showCompletion} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="bg-white rounded-[40px] p-10 w-full items-center shadow-2xl">
             <Text className="text-7xl mb-6">☀️</Text>
             <Text className="text-3xl font-black text-textMain mb-2 text-center">Habit Radiant!</Text>
             <Text className="text-textMuted font-bold text-center mb-10 leading-relaxed">
               You successfully crushed:{"\n"}
               <Text className="text-primary text-xl mt-2">{displayTitle}</Text>
             </Text>
             <TouchableOpacity 
               onPress={() => {
                 setShowCompletion(false);
                 scaleAnim.setValue(0);
                 if (activeHabit && onCompleteHabit) {
                   onCompleteHabit(activeHabit.id);
                 }
               }}
               className="w-full bg-primary py-5 rounded-full items-center shadow-lg shadow-primary/20"
             >
               <Text className="text-white font-black uppercase tracking-widest">Awesome!</Text>
             </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
