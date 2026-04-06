import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-[#FCF9F2]">
      <View className="flex-1 px-4 pt-10">
        
        {/* Header */}
        <View className="w-full flex-row justify-between mb-8 items-center px-2">
          <Text className="text-3xl font-extrabold text-[#3A2E28] tracking-tight">Today's Progress</Text>
          <TouchableOpacity className="w-10 h-10 bg-white items-center justify-center rounded-full shadow-sm shadow-orange-900/5">
             <Feather name="more-vertical" size={20} color="#C2B8B2" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 space-y-4" showsVerticalScrollIndicator={false}>
          {/* Main Pie Chart Card */}
          <View className="bg-white rounded-3xl p-6 flex-row justify-between items-center shadow-sm shadow-orange-900/5 border border-[#F2EAE0] mb-4">
             <View className="flex-1 mr-4">
                <Text className="text-xl font-extrabold text-[#3A2E28] mb-1 leading-snug">Overall {"\n"}Completion</Text>
                <Text className="text-xs text-[#A39081] mb-2 font-medium">Keep it up!</Text>
                <Text className="text-lg font-black text-[#FF7A59] mt-2 tracking-widest">{completedHabits} <Text className="text-[#C2B8B2]">/ {totalHabits}</Text></Text>
                <Text className="text-[10px] font-bold uppercase text-[#6B5A52] tracking-widest">Habits Done</Text>
             </View>
             
             {/* Dynamic SVG Pie Chart */}
             <View className="items-center justify-center relative w-28 h-28">
               <Text className="absolute text-[12px] font-extrabold text-[#3A2E28] text-center w-full uppercase tracking-wide">
                  {Math.round(progressPercent * 100)}%
               </Text>
               <Svg height="120" width="120" viewBox="0 0 120 120" className="absolute top-0 left-0">
                 <Circle cx="60" cy="60" r={radius} stroke="#F2EAE0" strokeWidth={strokeWidth} fill="none" />
                 <Circle
                   cx="60"
                   cy="60"
                   r={radius}
                   stroke="#FF7A59"
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
          <View className="bg-white rounded-3xl p-5 shadow-sm shadow-orange-900/5 border border-[#F2EAE0] mb-6">
             <Text className="text-sm font-bold text-[#6B5A52] mb-4 uppercase tracking-widest">Daily Bar Graph</Text>
             <View className="h-4 bg-[#F2EAE0] rounded-full w-full overflow-hidden">
                <View style={{width: `${progressPercent * 100}%`}} className="h-full bg-gradient-to-r from-[#FF7A59] to-[#F59E0B] bg-[#FF7A59] rounded-full"></View>
             </View>
             <View className="flex-row justify-between mt-3 px-1">
                <Text className="text-[10px] text-[#FF7A59] font-extrabold uppercase tracking-widest">{completedHabits} Done</Text>
                <Text className="text-[10px] text-[#A39081] font-bold uppercase tracking-widest">{totalHabits - completedHabits} Remaining</Text>
             </View>
          </View>

          <Text className="text-lg font-extrabold text-[#3A2E28] px-2 mt-2 mb-3">Remaining Habits</Text>

          {/* Remaining Habits List */}
          {remainingHabitsList.length === 0 ? (
             <View className="items-center bg-white rounded-3xl p-8 border border-[#F2EAE0] shadow-sm shadow-orange-900/5">
                <Text className="text-6xl mb-4">🏆</Text>
                <Text className="text-[#D97706] font-extrabold text-lg text-center mt-2">
                   Incredible!
                </Text>
                <Text className="text-[#6B5A52] font-semibold text-sm text-center mt-2">
                   You have crushed every single goal for today!
                </Text>
             </View>
          ) : (
            remainingHabitsList.map((habit) => (
              <View key={habit.id} className="bg-white rounded-3xl p-4 flex-row justify-between items-center shadow-sm shadow-orange-900/5 border border-[#F2EAE0] mb-3">
                 <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-[#FCF9F2] rounded-full justify-center items-center mr-3 border border-[#F2EAE0]">
                        <Feather name={habit.icon || "target"} size={18} color="#FF7A59" />
                    </View>
                    <View>
                       <Text className="text-sm font-extrabold text-[#3A2E28]">{habit.title}</Text>
                       <Text className="text-[10px] text-[#A39081] font-bold tracking-wide mt-1">{habit.subtitle}</Text>
                    </View>
                 </View>
                 <TouchableOpacity 
                   onPress={() => onStartHabit?.(habit)}
                   className="bg-[#FF7A59] px-5 py-3 rounded-xl ml-2 shadow-sm shadow-[#FF7A59]/20"
                 >
                    <Text className="text-white text-[10px] font-extrabold uppercase tracking-widest">Start</Text>
                 </TouchableOpacity>
              </View>
            ))
          )}
          
          <View className="h-24"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
