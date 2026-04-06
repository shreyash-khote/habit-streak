import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function TimerScreen({ activeHabit, onCompleteHabit }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeHabit) {
      const startSecs = activeHabit.durationSeconds || 1500;
      setTimeLeft(startSecs);
      setTotalTime(startSecs);
      setIsRunning(false);
    } else {
      // Default placeholder time
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
  const strokeWidth = 10;
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
    <SafeAreaView className="flex-1 bg-[#FCF9F2]">
      <ScrollView 
         contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} 
         className="flex-1 px-6 pt-10"
         showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between flex-start mb-10 w-full relative">
          <View>
            <Text className="text-2xl font-extrabold text-[#3A2E28] mb-1 tracking-tight">Today's Focus</Text>
            <Text className="text-sm font-bold text-[#A39081]">Monday October 25, 2023</Text>
          </View>
          <View className="bg-[#FFF2E0] w-12 h-12 rounded-full items-center justify-center shadow-sm shadow-orange-100">
             <Text className="text-2xl">🔥</Text>
          </View>
        </View>

        {/* Goal Title */}
        <Text className="text-lg font-bold text-[#6B5A52] text-center mb-8">{displayTitle}</Text>

        {/* Circular Timer UI */}
        <View className="items-center justify-center mb-8 relative">
          <Svg height="240" width="240" viewBox="0 0 240 240">
            {/* Background Circle */}
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#F2EAE0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle connected to SVG rendering */}
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#FF7A59"
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
             <Text className="text-5xl font-extrabold text-[#3A2E28] tracking-tight">{displayTime}</Text>
          </View>
        </View>
        
        {/* Digital Time Repetition (as in mockup) */}
        <Text className="text-4xl font-normal text-[#C2B8B2] text-center mb-10">{displayTime}</Text>

        {/* Controls */}
        <View className="flex-row justify-center space-x-4 mb-12 w-full">
          <TouchableOpacity 
            onPress={() => setIsRunning(true)}
            className="w-16 h-16 rounded-full bg-[#FF7A59] items-center justify-center shadow-lg shadow-[#FF7A59]/30">
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Start</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsRunning(false)}
            className="w-16 h-16 rounded-full bg-[#E11D48] items-center justify-center shadow-lg shadow-rose-900/10">
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setIsRunning(false);
              setTimeLeft(totalTime);
            }}
            className="w-16 h-16 rounded-full bg-[#D9CEBF] items-center justify-center shadow-md shadow-gray-200">
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Streaks Bottom */}
        <View className="flex-row justify-between w-full mt-auto mb-4 border-t border-[#F2EAE0] pt-6 px-2">
          <View>
            <Text className="text-sm font-bold text-[#6B5A52] mb-1">Current Streak</Text>
            <Text className="text-xs text-[#FF7A59] font-extrabold">🔥 5 days</Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-bold text-[#6B5A52] mb-1">Best Streak</Text>
            <Text className="text-xs text-[#A39081] font-bold">12 days</Text>
          </View>
        </View>
      </ScrollView>

      {/* Completion Modal Animation */}
      <Modal transparent visible={showCompletion} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="bg-[#FFFCF8] rounded-3xl p-8 w-full items-center shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
             <Text className="text-7xl mb-4 leading-tight">☀️</Text>
             <Text className="text-2xl font-extrabold text-[#3A2E28] mb-2 text-center text-orange-gradient">Habit Radiant!</Text>
             <Text className="text-[#A39081] font-medium text-center mb-8">
               You successfully crushed:{"\n"}
               <Text className="font-bold text-[#6B5A52] text-lg mt-1">{displayTitle}</Text>
             </Text>
             <TouchableOpacity 
               onPress={() => {
                 setShowCompletion(false);
                 scaleAnim.setValue(0);
                 if (activeHabit && onCompleteHabit) {
                   onCompleteHabit(activeHabit.id);
                 }
               }}
               className="w-full bg-[#FF7A59] py-4 rounded-full items-center shadow-sm"
             >
               <Text className="text-white font-extrabold uppercase tracking-widest">Awesome!</Text>
             </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
