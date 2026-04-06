import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Keyboard, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

export default function WelcomeScreen({ onAddHabit, habits = [] }) {
  // Add Habit Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputText, setInputText] = useState('');
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  
  const handleAdd = () => {
    if (inputText) {
      onAddHabit?.(inputText, days, hours, minutes, seconds);
      setInputText('');
      setDays('');
      setHours('');
      setMinutes('');
      setSeconds('');
      setShowAddForm(false);
    }
    Keyboard.dismiss();
  };

  // Math for Consistency Rate
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const consistencyRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  
  // SVG Math for Semi-Circle Progress
  const radius = 55;
  const arcLength = Math.PI * radius; 
  const progressPercent = totalHabits > 0 ? (completedHabits / totalHabits) : 0;
  const strokeDashoffset = arcLength * (1 - progressPercent);

  // Soft progress bar colors 
  const barColors = ['bg-[#FFB5A7]', 'bg-[#FDE29F]', 'bg-[#FFCAD4]', 'bg-[#D9CEBF]'];

  return (
    <SafeAreaView className="flex-1 bg-[#FCF9F2]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-5 pt-8" 
          contentContainerStyle={{ paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        
        {/* Header Block */}
        <View className="items-center mb-6">
           <Text className="text-3xl font-extrabold text-[#3A2E28] tracking-tight mb-1">Habit Coach</Text>
           <Text className="text-xs font-semibold text-[#8C7A6B]">
             Last synced with your habits just now
           </Text>
        </View>

        {/* Date & Icons Row */}
        <View className="flex-row justify-between items-center mb-6">
           <TouchableOpacity className="flex-row items-center bg-white px-4 py-2.5 rounded-full shadow-md shadow-orange-900/10 border border-[#F2EAE0]">
              <Feather name="calendar" size={16} color="#6B5A52" />
              <Text className="font-bold text-[#3A2E28] ml-2 mr-1 text-sm">Today</Text>
              <Feather name="chevron-down" size={14} color="#6B5A52" />
           </TouchableOpacity>
           
           <View className="flex-row space-x-2">
             <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md shadow-orange-900/10 border border-[#F2EAE0]">
                <Feather name="edit-2" size={16} color="#6B5A52" />
             </TouchableOpacity>
             <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md shadow-orange-900/10 border border-[#F2EAE0]">
                <Feather name="more-vertical" size={16} color="#6B5A52" />
             </TouchableOpacity>
           </View>
        </View>

        {/* Add Habit Section MOVED TO THE TOP */}
        {!showAddForm ? (
          <TouchableOpacity 
             onPress={() => setShowAddForm(true)}
             className="bg-white rounded-3xl p-6 shadow-md shadow-orange-900/10 border border-[#F2EAE0] flex-row justify-between items-center mb-6"
          >
             <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#FFFDFB] rounded-full items-center justify-center border border-[#F2EAE0] shadow-sm">
                  <Feather name="plus" size={20} color="#FF7A59" />
                </View>
                <Text className="font-extrabold text-[#3A2E28] text-base ml-4">Add New Habit</Text>
             </View>
             <Feather name="chevron-right" size={18} color="#C2B8B2" />
          </TouchableOpacity>
        ) : (
          <View className="bg-white rounded-3xl p-6 shadow-md shadow-[#FF7A59]/10 border border-[#FFD6CC] mb-6">
             <View className="flex-row justify-between items-center mb-4">
                <Text className="font-extrabold text-[#3A2E28] text-base">New Habit</Text>
                <TouchableOpacity onPress={() => setShowAddForm(false)}>
                   <Feather name="x" size={20} color="#C2B8B2" />
                </TouchableOpacity>
             </View>

             {/* Input Area */}
             <View className="w-full bg-[#FCF9F2] rounded-2xl flex-row items-center px-4 py-3 shadow-sm border border-[#F2EAE0] mb-3">
               <Feather name="type" size={18} color="#A39081" />
               <TextInput 
                 value={inputText}
                 onChangeText={setInputText}
                 placeholder="Ex. Morning Run" 
                 placeholderTextColor="#A39081"
                 className="flex-1 text-sm ml-2 text-[#3A2E28] font-bold"
                 returnKeyType="next"
               />
             </View>

             <View className="w-full bg-[#FCF9F2] rounded-2xl flex-row items-center px-4 py-3 shadow-sm border border-[#F2EAE0] mb-3">
               <Feather name="calendar" size={18} color="#A39081" />
               <TextInput 
                 value={days}
                 onChangeText={setDays}
                 placeholder="Target Days (e.g. 21)" 
                 placeholderTextColor="#A39081"
                 keyboardType="numeric"
                 className="flex-1 text-sm ml-2 text-[#3A2E28] font-bold"
                 returnKeyType="next"
               />
             </View>

             <View className="w-full flex-row items-center justify-between space-x-2 mb-4">
               <View className="flex-1 bg-[#FCF9F2] rounded-xl px-2 py-3 border border-[#F2EAE0] shadow-sm">
                 <TextInput 
                   value={hours}
                   onChangeText={setHours}
                   placeholder="Hr" 
                   placeholderTextColor="#A39081"
                   keyboardType="numeric"
                   className="text-center text-[#3A2E28] font-bold"
                 />
               </View>
               <Text className="font-bold text-[#A39081]">:</Text>
               <View className="flex-1 bg-[#FCF9F2] rounded-xl px-2 py-3 border border-[#F2EAE0] shadow-sm">
                 <TextInput 
                   value={minutes}
                   onChangeText={setMinutes}
                   placeholder="Min" 
                   placeholderTextColor="#A39081"
                   keyboardType="numeric"
                   className="text-center text-[#3A2E28] font-bold"
                 />
               </View>
               <Text className="font-bold text-[#A39081]">:</Text>
               <View className="flex-1 bg-[#FCF9F2] rounded-xl px-2 py-3 border border-[#F2EAE0] shadow-sm">
                 <TextInput 
                   value={seconds}
                   onChangeText={setSeconds}
                   placeholder="Sec" 
                   placeholderTextColor="#A39081"
                   keyboardType="numeric"
                   className="text-center text-[#3A2E28] font-bold"
                 />
               </View>
             </View>

             <TouchableOpacity 
               onPress={handleAdd}
               className="w-full py-4 rounded-full bg-[#FF7A59] items-center justify-center shadow-lg shadow-[#FF7A59]/30"
             >
               <Text className="font-extrabold text-[#FFFDFB] tracking-widest uppercase text-[10px]">Create Goal</Text>
             </TouchableOpacity>
          </View>
        )}

        {/* Consistency Rate Hero Card */}
        <View className="bg-[#FFEFE2] rounded-[32px] p-6 flex-row justify-between items-center shadow-md shadow-orange-900/10 mb-6">
           {/* Left Info */}
           <View className="flex-1 justify-center">
              <View className="flex-row items-center bg-[#FFDFB3] self-start px-3 py-1.5 rounded-full mb-3 shadow-[0_2px_4px_rgba(217,119,6,0.1)]">
                 <Feather name="zap" size={14} color="#D97706" />
                 <Text className="text-sm font-bold text-[#3A2E28] ml-1.5 tracking-tight">Consistency</Text>
              </View>
              <Text className="text-5xl font-black text-[#3A2E28] tracking-tighter shadow-sm shadow-[#3A2E28]/5 pt-2">
                {consistencyRate}%
              </Text>
           </View>
           
           {/* Right Arc Gauge */}
           <View className="items-center justify-center relative w-36 h-36 mt-4">
              <Svg height="110" width="140" viewBox="0 0 140 100" className="absolute top-0 right-0">
                 {/* Track Background (White) */}
                 <Path
                    d="M 15 75 A 55 55 0 0 1 125 75"
                    stroke="#FFFFFF"
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                 />
                 {/* Progress Indicator (Warm Amber) */}
                 <Path
                    d="M 15 75 A 55 55 0 0 1 125 75"
                    stroke="#FF7A59"
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={strokeDashoffset}
                 />
              </Svg>
              {/* Inner White Container */}
              <View className="absolute bg-[#FFFDFB] w-20 h-20 rounded-full items-center justify-center top-[18px] shadow-sm shadow-orange-900/5">
                 <Text className="text-xl font-bold text-[#3A2E28]">{completedHabits}</Text>
                 <View className="w-8 h-[1px] bg-[#F2EAE0] my-0.5" />
                 <Text className="text-xs font-semibold text-[#8C7A6B]">{totalHabits}</Text>
              </View>
           </View>
        </View>

        {/* Achievements Section */}
        <View className="mb-6">
           <View className="flex-row justify-between items-center mb-4">
              <Text className="font-extrabold text-[#3A2E28] text-base ml-1">Recent Trophies</Text>
              <TouchableOpacity>
                 <Text className="text-xs font-extrabold text-[#FF7A59] uppercase tracking-widest mr-1">View All</Text>
              </TouchableOpacity>
           </View>
           
           <View className="flex-row justify-between space-x-3">
              <View className="flex-1 bg-white p-4 rounded-[24px] shadow-md shadow-orange-900/10 border border-[#F2EAE0] items-center justify-center">
                 <Text className="text-3xl mb-2">🔥</Text>
                 <Text className="text-[9px] font-extrabold text-[#6B5A52] text-center uppercase tracking-wide leading-tight">3 Day{'\n'}Streak</Text>
              </View>
              <View className="flex-1 bg-white p-4 rounded-[24px] shadow-md shadow-orange-900/10 border border-[#F2EAE0] items-center justify-center">
                 <Text className="text-3xl mb-2">🌅</Text>
                 <Text className="text-[9px] font-extrabold text-[#6B5A52] text-center uppercase tracking-wide leading-tight">Early{'\n'}Starter</Text>
              </View>
              <View className="flex-1 bg-[#FFF9F0] p-4 rounded-[24px] shadow-md shadow-[#D97706]/10 border border-[#FFDFB3] items-center justify-center">
                 <Text className="text-3xl mb-2">🏆</Text>
                 <Text className="text-[9px] font-extrabold text-[#D97706] text-center uppercase tracking-wide leading-tight">Goal{'\n'}Crusher</Text>
              </View>
           </View>
        </View>

        {/* Detailed Progress Card */}
        <View className="bg-white rounded-3xl p-6 shadow-md shadow-orange-900/10 border border-[#F2EAE0] mb-6">
           <View className="flex-row justify-between items-center mb-6">
             <View className="flex-row items-center">
                <Feather name="pie-chart" size={18} color="#6B5A52" />
                <Text className="font-extrabold text-[#3A2E28] text-base ml-2">Habit Progress</Text>
             </View>
             <Feather name="chevron-right" size={18} color="#C2B8B2" />
           </View>

           {totalHabits === 0 ? (
             <Text className="text-center font-medium text-[#8C7A6B] py-4">No habits added yet.</Text>
           ) : (
             <View className="space-y-5">
               {habits.slice(0, 3).map((habit, index) => {
                 const colorClass = barColors[index % barColors.length];
                 
                 const target = habit.targetDays || 21;
                 const currentStreak = habit.streak || 0;
                 const progressPercent = Math.min((currentStreak / target) * 100, 100);
                 
                 return (
                   <View key={habit.id}>
                     <View className="flex-row justify-between items-end mb-1">
                       <Text className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-widest">{habit.title}</Text>
                       <View className="flex-row items-baseline">
                         <Text className="font-extrabold text-[#3A2E28] text-sm shadow-sm shadow-[#3A2E28]/5 pt-1">
                           {currentStreak}
                         </Text>
                         <Text className="text-xs font-bold text-[#8C7A6B] ml-1">
                           / {target} Days
                         </Text>
                       </View>
                     </View>
                     {/* Horizontal Progress Bar */}
                     <View className="h-3 bg-[#FCF9F2] border border-[#F2EAE0] rounded-full w-full flex-row">
                        <View 
                           className={`h-full rounded-full ${colorClass}`}
                           style={{ width: `${Math.max(progressPercent, 5)}%` }} 
                        />
                     </View>
                   </View>
                 );
               })}
             </View>
           )}
        </View>
        
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
