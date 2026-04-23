import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

export default function ProgressDetailScreen({ habits = [], onStartHabit }) {
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const remainingHabitsList = habits.filter(h => !h.completed);
  const progressPercent = totalHabits > 0 ? (completedHabits / totalHabits) : 0;

  const radius = 50;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-8 pt-12">
        
        {/* Header */}
        <View className="w-full flex-row justify-between mb-10 items-center px-1">
          <Text className="text-3xl font-black text-textMain tracking-tight">Today's Progress</Text>
          <TouchableOpacity className="w-10 h-10 bg-white items-center justify-center rounded-full shadow-sm border border-[#F2EAE0]">
             <Feather name="more-vertical" size={20} color="#C2B8B2" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Main Pie Chart Card */}
          <View className="bg-white rounded-[40px] p-8 flex-row justify-between items-center shadow-sm border border-[#F2EAE0] mb-6">
             <View className="flex-1 mr-4">
                <Text className="text-xl font-black text-textMain mb-2 leading-tight">Overall {"\n"}Completion</Text>
                <Text className="text-xs text-textMuted mb-4 font-bold uppercase tracking-widest">Keep it up!</Text>
                <Text className="text-lg font-black text-primary tracking-widest">{completedHabits} <Text className="text-[#C2B8B2]">/ {totalHabits}</Text></Text>
                <Text className="text-[10px] font-black uppercase text-textMuted tracking-[2px]">Habits Done</Text>
             </View>
             
             {/* Dynamic SVG Pie Chart */}
             <View className="items-center justify-center relative w-28 h-28">
               <Text className="absolute text-[12px] font-black text-textMain text-center w-full uppercase tracking-tighter">
                  {Math.round(progressPercent * 100)}%
               </Text>
               <Svg height="120" width="120" viewBox="0 0 120 120" className="absolute top-0 left-0">
                 <Circle cx="60" cy="60" r={radius} stroke="#F2EAE0" strokeWidth={strokeWidth} fill="none" />
                 <Circle
                   cx="60"
                   cy="60"
                   r={radius}
                   stroke="#A04040"
                   strokeWidth={strokeWidth}
                   strokeDasharray={circumference}
                   strokeDashoffset={strokeDashoffset}
                   strokeLinecap="round"
                   fill="none"
                   rotation="-90"
                   origin="60, 60"
                 />
               </Svg>
             </View>
          </View>

          {/* Simple Bargraph Visualization */}
          <View className="bg-white rounded-[40px] p-8 shadow-sm border border-[#F2EAE0] mb-10">
             <Text className="text-[10px] font-black text-textMuted mb-6 uppercase tracking-[2px]">Daily Timeline</Text>
             <View className="h-4 bg-background rounded-full w-full overflow-hidden border border-[#F2EAE0]">
                <View style={{width: `${progressPercent * 100}%`}} className="h-full bg-primary rounded-full"></View>
             </View>
             <View className="flex-row justify-between mt-4 px-1">
                <Text className="text-[10px] text-primary font-black uppercase tracking-widest">{completedHabits} Done</Text>
                <Text className="text-[10px] text-textMuted font-black uppercase tracking-widest">{totalHabits - completedHabits} Remaining</Text>
             </View>
          </View>

          <Text className="text-xl font-black text-textMain px-2 mb-6">Remaining Habits</Text>

          {/* Remaining Habits List */}
          {remainingHabitsList.length === 0 ? (
             <View className="items-center bg-white rounded-[40px] p-10 border border-[#F2EAE0] shadow-sm">
                <Text className="text-6xl mb-6">🏆</Text>
                <Text className="text-primary font-black text-xl text-center">
                   Incredible!
                </Text>
                <Text className="text-textMuted font-bold text-sm text-center mt-3 leading-relaxed">
                   You have crushed every single goal for today!
                </Text>
             </View>
          ) : (
            <View className="gap-y-4">
              {remainingHabitsList.map((habit) => (
                <View key={habit.id} className="bg-white rounded-[32px] p-5 flex-row justify-between items-center shadow-sm border border-[#F2EAE0] mb-4">
                   <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 bg-background rounded-full justify-center items-center mr-4 border border-[#F2EAE0]">
                          <Feather name={habit.icon || "target"} size={20} color="#A04040" />
                      </View>
                      <View className="flex-1">
                         <Text className="text-base font-black text-textMain" numberOfLines={1}>{habit.title}</Text>
                         <Text className="text-[10px] text-textMuted font-bold tracking-wide mt-1 uppercase" numberOfLines={1}>{habit.subtitle}</Text>
                      </View>
                   </View>
                   <TouchableOpacity 
                     onPress={() => onStartHabit?.(habit)}
                     className="bg-primary px-6 py-3 rounded-2xl ml-4 shadow-lg shadow-primary/20"
                   >
                      <Text className="text-white text-[10px] font-black uppercase tracking-widest">Start</Text>
                   </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <View className="h-40"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
