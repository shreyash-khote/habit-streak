import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

/**
 * TimerScreen — all timer state is owned by App.js and passed as props.
 * This prevents the timer from resetting when the user switches tabs.
 *
 * Props:
 *   activeHabit    – the habit being timed (or null)
 *   onCompleteHabit – callback when timer finishes and user taps Awesome
 *   timeLeft / setTimeLeft   – current remaining seconds
 *   totalTime / setTotalTime – total duration (for progress ring)
 *   isRunning / setIsRunning – play/pause state
 */
export default function TimerScreen({
  activeHabit,
  onCompleteHabit,
  timeLeft,
  setTimeLeft,
  totalTime,
  setTotalTime,
  isRunning,
  setIsRunning,
}) {
  const showCompletion = timeLeft <= 0 && totalTime > 0 && !isRunning;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Run the countdown interval while isRunning is true
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Animate completion modal
  useEffect(() => {
    if (showCompletion) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
  }, [showCompletion]);

  // ── Circular progress ──
  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - circumference * progressPercent;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayTime = formatTime(Math.max(timeLeft, 0));
  const displayTitle = activeHabit ? activeHabit.title : 'No habit selected';

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
            <Text className="text-xs font-bold text-textMuted uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
          <View className="flex-row space-x-3">
            <View className="bg-[#FFF2E0] w-10 h-10 rounded-full items-center justify-center shadow-sm border border-[#FDE6C8]">
              <Text className="text-xl">🔥</Text>
            </View>
          </View>
        </View>

        {/* Habit Title */}
        <Text className="text-base font-extrabold text-textMain text-center mb-10 tracking-wide">
          {displayTitle}
        </Text>

        {/* Circular Timer */}
        <View className="items-center justify-center mb-12 relative">
          <Svg height="260" width="260" viewBox="0 0 240 240">
            <Circle cx="120" cy="120" r={radius} stroke="#F2EAE0" strokeWidth={strokeWidth} fill="none" />
            <Circle
              cx="120" cy="120" r={radius}
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

        {/* Digital display */}
        <Text className="text-4xl font-normal text-[#C2B8B2] text-center mb-12">{displayTime}</Text>

        {/* Controls */}
        <View className="flex-row justify-center space-x-4 mb-16">
          <TouchableOpacity
            onPress={() => setIsRunning(true)}
            disabled={timeLeft <= 0}
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

        {/* Streak footer */}
        <View className="flex-row justify-between items-center mt-auto pt-6">
          <View>
            <Text className="text-xl font-extrabold text-[#3A2E28] mb-1">Current Streak</Text>
            <View className="flex-row items-center">
              <Text className="text-lg mr-1">🔥</Text>
              <Text className="text-lg text-[#A04040] font-extrabold">
                {activeHabit?.current_streak || 0} {activeHabit?.current_streak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
          <View className="w-16 h-16 bg-[#FFF2E0] rounded-full items-center justify-center border border-[#FDE6C8] shadow-sm">
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
              You successfully crushed:{'\n'}
              <Text className="text-primary text-xl mt-2">{displayTitle}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (activeHabit && onCompleteHabit) {
                  onCompleteHabit(activeHabit.id);
                }
              }}
              className="w-full bg-primary py-5 rounded-full items-center shadow-lg shadow-primary/20">
              <Text className="text-white font-black uppercase tracking-widest">Awesome!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
