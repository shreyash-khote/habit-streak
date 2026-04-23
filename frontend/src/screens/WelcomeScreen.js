import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, ScrollView, Animated, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';


const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = -15; i <= 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const formatDateKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export default function WelcomeScreen({ onAddHabit, habits = [] }) {
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const calendarRef = useRef(null);
  const allDates = generateDates();
  const todayIndex = 15; // middle of 31 dates

  useEffect(() => {
    // Initial scroll to Today (the middle item)
    setTimeout(() => {
      calendarRef.current?.scrollToIndex({
        index: todayIndex,
        animated: true,
        viewPosition: 0.5
      });
    }, 500);
  }, []);
  
  // Add Habit Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputText, setInputText] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  
  // Starting Time & Picker State
  const [startTime, setStartTime] = useState('08:00 AM');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHour, setTempHour] = useState('08');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempPeriod, setTempPeriod] = useState('AM');
  
  // Frequency State
  const [frequency, setFrequency] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [selectedWeekDays, setSelectedWeekDays] = useState(new Set()); 
  const [selectedMonthDates, setSelectedMonthDates] = useState(new Set());
  
  const handleAdd = () => {
    if (inputText) {
      // Convert sets to comma-separated strings for the backend
      const freqDays = Array.from(selectedWeekDays).sort().join(',');
      const freqDates = Array.from(selectedMonthDates).sort().join(',');
      
      onAddHabit?.(inputText, startTime, hours, minutes, seconds, {
        frequency_type: frequency,
        frequency_days: frequency === 'weekly' ? freqDays : null,
        frequency_dates: frequency === 'monthly' ? freqDates : null,
        start_time: startTime
      });

      setInputText('');
      setHours('');
      setMinutes('');
      setSeconds('');
      setFrequency('daily');
      setSelectedWeekDays(new Set());
      setSelectedMonthDates(new Set());
      setShowAddForm(false);
    }
    Keyboard.dismiss();
  };

  const toggleWeekDay = (dayIndex) => {
    const newSet = new Set(selectedWeekDays);
    if (newSet.has(dayIndex)) newSet.delete(dayIndex);
    else newSet.add(dayIndex);
    setSelectedWeekDays(newSet);
  };

  const toggleMonthDate = (date) => {
    const newSet = new Set(selectedMonthDates);
    if (newSet.has(date)) newSet.delete(date);
    else newSet.add(date);
    setSelectedMonthDates(newSet);
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

  return (
    <SafeAreaView className="flex-1 bg-background">
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
           <Text className="text-3xl font-extrabold text-textMain tracking-tight mb-1">Habit Coach</Text>
           <Text className="text-xs font-semibold text-textMuted">
             Last synced with your habits just now
           </Text>
        </View>

        {/* Date & Icons Row - Horizontal Calendar */}
        <View className="mb-6">
           <FlatList
             ref={calendarRef}
             data={allDates}
             horizontal
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item) => formatDateKey(item)}
             getItemLayout={(data, index) => ({
               length: 64, // estimated item width + margin
               offset: 64 * index,
               index,
             })}
             onScrollToIndexFailed={() => {}}
             contentContainerStyle={{ paddingHorizontal: 2 }}
             renderItem={({ item, index }) => {
               const dayName = item.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
               const dayNum = item.getDate();
               const isSelected = formatDateKey(item) === selectedDate;
               
               return (
                 <TouchableOpacity 
                   onPress={() => setSelectedDate(formatDateKey(item))}
                   className="items-center mx-2"
                 >
                   <Text className="text-[10px] font-bold uppercase tracking-wider mb-2 text-textMuted">
                     {dayName}
                   </Text>
                   <View className={`w-10 h-10 rounded-full items-center justify-center shadow-sm ${
                     isSelected 
                      ? 'bg-primary shadow-primary/20' 
                      : 'bg-white border border-[#F2EAE0]'
                   }`}>
                     <Text className={`text-sm font-extrabold ${
                       isSelected ? 'text-white' : 'text-textMain'
                     }`}>
                       {dayNum}
                     </Text>
                   </View>
                 </TouchableOpacity>
               );
             }}
           />
        </View>

        {/* Add Habit Section */}
        {!showAddForm ? (
          <TouchableOpacity 
             onPress={() => setShowAddForm(true)}
             className="bg-white rounded-3xl p-6 shadow-sm shadow-orange-900/5 border border-[#F2EAE0] flex-row justify-between items-center mb-6"
          >
             <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#FFFDFB] rounded-full items-center justify-center border border-[#F2EAE0] shadow-sm">
                  <Feather name="plus" size={20} color="#A04040" />
                </View>
                <Text className="font-extrabold text-textMain text-base ml-4">Add New Habit</Text>
             </View>
             <Feather name="chevron-right" size={18} color="#C2B8B2" />
          </TouchableOpacity>
        ) : (
          <View className="bg-white rounded-3xl p-6 shadow-md shadow-primary/10 border border-[#FFD6CC] mb-6">
             <View className="flex-row justify-between items-center mb-4">
                <Text className="font-extrabold text-textMain text-base">New Habit</Text>
                <TouchableOpacity onPress={() => setShowAddForm(false)}>
                   <Feather name="x" size={20} color="#C2B8B2" />
                </TouchableOpacity>
             </View>

             <View className="w-full bg-background rounded-2xl flex-row items-center px-4 py-3 shadow-sm border border-[#F2EAE0] mb-3">
               <Feather name="type" size={18} color="#A39081" />
               <TextInput 
                 value={inputText}
                 onChangeText={setInputText}
                 placeholder="Ex. Morning Run" 
                 placeholderTextColor="#A39081"
                 className="flex-1 text-sm ml-2 text-textMain font-bold"
                 returnKeyType="next"
               />
             </View>

             {/* Starting Time Selector */}
             <TouchableOpacity 
               onPress={() => setShowTimePicker(true)}
               className="w-full bg-background rounded-2xl flex-row items-center px-4 py-3 shadow-sm border border-[#F2EAE0] mb-3"
             >
               <Feather name="clock" size={18} color="#A39081" />
               <View className="flex-1 ml-2">
                 <Text className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Starting Time</Text>
                 <Text className="text-sm text-textMain font-black">{startTime}</Text>
               </View>
               <Feather name="edit-2" size={14} color="#C2B8B2" />
             </TouchableOpacity>

             {/* Frequency Selector */}
             <Text className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-3 ml-1 mt-1">Frequency</Text>
             <View className="flex-row bg-background rounded-2xl p-1.5 border border-[#F2EAE0] mb-4">
               {['daily', 'weekly', 'monthly'].map((f) => (
                 <TouchableOpacity 
                   key={f}
                   onPress={() => setFrequency(f)}
                   className={`flex-1 py-2.5 rounded-xl items-center ${frequency === f ? 'bg-primary shadow-sm' : 'bg-transparent'}`}
                 >
                   <Text className={`text-[10px] font-black uppercase tracking-widest ${frequency === f ? 'text-white' : 'text-textMuted'}`}>
                     {f}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>

             {/* Weekly Selection pop */}
             {frequency === 'weekly' && (
               <View className="mb-6 px-1">
                 <View className="flex-row justify-between">
                   {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                     <TouchableOpacity 
                       key={idx}
                       onPress={() => toggleWeekDay(idx)}
                       className={`w-9 h-9 items-center justify-center rounded-full border ${
                         selectedWeekDays.has(idx) 
                           ? 'bg-primary border-primary shadow-sm' 
                           : 'bg-white border-[#F2EAE0]'
                       }`}
                     >
                       <Text className={`text-[10px] font-black ${selectedWeekDays.has(idx) ? 'text-white' : 'text-textMain'}`}>
                         {day}
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </View>
               </View>
             )}

             {/* Monthly Selection pop */}
             {frequency === 'monthly' && (
               <View className="mb-6 bg-background p-4 rounded-3xl border border-[#F2EAE0]">
                  <View className="flex-row flex-wrap justify-start">
                   {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                     <TouchableOpacity 
                       key={date}
                       onPress={() => toggleMonthDate(date)}
                       className={`w-7 h-7 items-center justify-center rounded-lg m-1 border ${
                         selectedMonthDates.has(date) 
                           ? 'bg-primary border-primary shadow-sm' 
                           : 'bg-white border-[#F2EAE0]'
                       }`}
                     >
                       <Text className={`text-[9px] font-black ${selectedMonthDates.has(date) ? 'text-white' : 'text-textMain'}`}>
                         {date}
                       </Text>
                     </TouchableOpacity>
                   ))}
                  </View>
               </View>
             )}

             <View className="w-full flex-row items-center justify-between space-x-2 mb-4">
               <View className="flex-1 bg-background rounded-xl px-2 py-3 border border-[#F2EAE0] shadow-sm">
                 <TextInput 
                   value={hours}
                   onChangeText={setHours}
                   placeholder="Hr" 
                   placeholderTextColor="#A39081"
                   keyboardType="numeric"
                   className="text-center text-textMain font-bold"
                 />
               </View>
               <Text className="font-bold text-[#A39081]">:</Text>
               <View className="flex-1 bg-background rounded-xl px-2 py-3 border border-[#F2EAE0] shadow-sm">
                 <TextInput 
                   value={minutes}
                   onChangeText={setMinutes}
                   placeholder="Min" 
                   placeholderTextColor="#A39081"
                   keyboardType="numeric"
                   className="text-center text-textMain font-bold"
                 />
               </View>
               <Text className="font-bold text-[#A39081]">:</Text>
               <View className="flex-1 bg-background rounded-xl px-2 py-3 border border-[#F2EAE0] shadow-sm">
                 <TextInput 
                   value={seconds}
                   onChangeText={setSeconds}
                   placeholder="Sec" 
                   placeholderTextColor="#A39081"
                   keyboardType="numeric"
                   className="text-center text-textMain font-bold"
                 />
               </View>
             </View>

             <TouchableOpacity 
               onPress={handleAdd}
               className="w-full py-4 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30"
             >
               <Text className="font-extrabold text-white tracking-widest uppercase text-[10px]">Create Goal</Text>
             </TouchableOpacity>
           </View>
        )}

        {/* Custom Clock Modal */}
        {showTimePicker && (
          <View className="absolute inset-0 bg-black/40 z-[100] items-center justify-center px-6">
            <View className="bg-white w-full rounded-[40px] p-8 shadow-2xl">
              <Text className="text-center font-black text-textMain text-xl mb-8">Set Start Time</Text>
              
              <View className="flex-row justify-center items-center mb-8 space-x-4">
                {/* Hour Col */}
                <View className="items-center">
                  <Text className="text-[10px] font-extrabold text-textMuted uppercase mb-2">Hour</Text>
                  <TextInput 
                    value={tempHour}
                    onChangeText={setTempHour}
                    keyboardType="numeric"
                    maxLength={2}
                    className="text-4xl font-black text-primary bg-background px-4 py-2 rounded-2xl w-20 text-center"
                  />
                </View>
                
                <Text className="text-3xl font-black text-textMuted mt-4">:</Text>
                
                {/* Minute Col */}
                <View className="items-center">
                  <Text className="text-[10px] font-extrabold text-textMuted uppercase mb-2">Minute</Text>
                  <TextInput 
                    value={tempMinute}
                    onChangeText={setTempMinute}
                    keyboardType="numeric"
                    maxLength={2}
                    className="text-4xl font-black text-primary bg-background px-4 py-2 rounded-2xl w-20 text-center"
                  />
                </View>

                {/* Period Picker */}
                <View className="ml-4 space-y-2">
                  {['AM', 'PM'].map(p => (
                    <TouchableOpacity 
                      key={p}
                      onPress={() => setTempPeriod(p)}
                      className={`px-3 py-2 rounded-xl ${tempPeriod === p ? 'bg-primary' : 'bg-background border border-[#F2EAE0]'}`}
                    >
                      <Text className={`text-xs font-black ${tempPeriod === p ? 'text-white' : 'text-textMuted'}`}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => {
                  setStartTime(`${tempHour.padStart(2, '0')}:${tempMinute.padStart(2, '0')} ${tempPeriod}`);
                  setShowTimePicker(false);
                }}
                className="w-full py-4 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30"
              >
                <Text className="font-extrabold text-white tracking-widest uppercase text-[12px]">Save Time</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowTimePicker(false)}
                className="w-full mt-4 py-2 items-center"
              >
                <Text className="font-bold text-textMuted text-[10px] uppercase">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Consistency Rate Hero Card */}
        <View className="bg-[#FFEFE2] rounded-[40px] p-8 flex-row justify-between items-center shadow-sm shadow-orange-900/5 mb-6">
           <View className="flex-1 justify-center">
              <View className="flex-row items-center bg-[#FFDFB3] self-start px-3 py-1.5 rounded-full mb-3">
                 <Feather name="zap" size={14} color="#D97706" />
                 <Text className="text-[10px] font-bold text-textMain ml-1.5 tracking-tight uppercase">Consistency</Text>
              </View>
              <Text className="text-5xl font-black text-textMain tracking-tighter">
                {consistencyRate}%
              </Text>
           </View>
           
           <View className="items-center justify-center relative w-36 h-36">
              <Svg height="110" width="140" viewBox="0 0 140 100" className="absolute top-0 right-0">
                 <Path
                    d="M 15 75 A 55 55 0 0 1 125 75"
                    stroke="#FFFFFF"
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                 />
                 <Path
                    d="M 15 75 A 55 55 0 0 1 125 75"
                    stroke="#1B3022"
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={strokeDashoffset}
                 />
              </Svg>
              <View className="absolute bg-white w-20 h-20 rounded-full items-center justify-center top-[18px] shadow-sm shadow-orange-900/5">
                 <Text className="text-xl font-bold text-textMain">{completedHabits}</Text>
                 <View className="w-8 h-[1px] bg-[#F2EAE0] my-0.5" />
                 <Text className="text-xs font-semibold text-textMuted">{totalHabits}</Text>
              </View>
           </View>
        </View>

        {/* Achievements Section */}
        <View className="mb-6">
           <View className="flex-row justify-between items-center mb-5">
              <Text className="font-extrabold text-textMain text-base ml-1">Recent Trophies</Text>
              <TouchableOpacity>
                 <Text className="text-[10px] font-extrabold text-primary uppercase tracking-widest mr-1">View All</Text>
              </TouchableOpacity>
           </View>
           
           <View className="flex-row justify-between space-x-3">
              <View className="flex-1 bg-card p-5 rounded-[28px] shadow-sm shadow-orange-900/5 items-center justify-center">
                 <View className="bg-white w-12 h-12 rounded-2xl items-center justify-center mb-3 shadow-sm shadow-orange-900/5">
                   <Text className="text-2xl">🔥</Text>
                 </View>
                 <Text className="text-[8px] font-extrabold text-textMuted text-center uppercase tracking-widest leading-tight">3 Day{'\n'}Streak</Text>
              </View>
              <View className="flex-1 bg-card p-5 rounded-[28px] shadow-sm shadow-orange-900/5 items-center justify-center">
                 <View className="bg-white w-12 h-12 rounded-2xl items-center justify-center mb-3 shadow-sm shadow-orange-900/5">
                   <Text className="text-2xl">🌅</Text>
                 </View>
                 <Text className="text-[8px] font-extrabold text-textMuted text-center uppercase tracking-widest leading-tight">Early{'\n'}Starter</Text>
              </View>
              <View className="flex-1 bg-card p-5 rounded-[28px] shadow-sm shadow-orange-900/5 items-center justify-center">
                 <View className="bg-white w-12 h-12 rounded-2xl items-center justify-center mb-3 shadow-sm shadow-orange-900/5">
                   <Text className="text-2xl">🏆</Text>
                 </View>
                 <Text className="text-[8px] font-extrabold text-primary text-center uppercase tracking-widest leading-tight">Goal{'\n'}Crusher</Text>
              </View>
           </View>
        </View>

        {/* Detailed Progress Card */}
        <View className="bg-white rounded-[40px] p-8 shadow-sm shadow-orange-900/5 mb-6">
           <View className="flex-row justify-between items-center mb-6">
             <View className="flex-row items-center">
                <Feather name="pie-chart" size={18} color="#6B5A52" />
                <Text className="font-extrabold text-textMain text-base ml-2">Habit Progress</Text>
             </View>
             <Feather name="chevron-right" size={18} color="#C2B8B2" />
           </View>

           {totalHabits === 0 ? (
             <Text className="text-center font-medium text-textMuted py-4">No habits added yet.</Text>
           ) : (
             <View className="space-y-6">
               {habits.slice(0, 3).map((habit) => {
                 const target = habit.targetDays || 21;
                 const currentStreak = habit.streak || 0;
                 const progressPercent = Math.min((currentStreak / target) * 100, 100);
                 
                 return (
                   <View key={habit.id}>
                     <View className="flex-row justify-between items-end mb-2">
                       <Text className="text-[9px] font-extrabold text-textMuted uppercase tracking-[2px]">{habit.title}</Text>
                       <View className="flex-row items-baseline">
                         <Text className="font-black text-textMain text-sm">
                           {currentStreak}
                         </Text>
                         <Text className="text-[10px] font-bold text-textMuted ml-1">
                           / {target} Days
                         </Text>
                       </View>
                     </View>
                     <View className="h-[6px] bg-background rounded-full w-full overflow-hidden">
                        <View 
                           className="h-full rounded-full bg-primary"
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
