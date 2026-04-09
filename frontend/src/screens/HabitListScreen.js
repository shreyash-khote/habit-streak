import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function HabitListScreen({ habits = [], onStartHabit, onDeleteHabit }) {
  const confirmDelete = (habitId, habitTitle) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to delete "${habitTitle}"?`);
      if (confirmed) onDeleteHabit?.(habitId);
    } else {
      Alert.alert(
        "Delete Habit?",
        `Are you sure you want to delete "${habitTitle}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => onDeleteHabit?.(habitId) }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-12 relative">
        {/* Header */}
        <View className="w-full flex-row justify-between mb-10 items-center px-1">
          <Text className="text-3xl font-black text-textMain tracking-tight">Your Habits</Text>
          <View className="flex-row">
            <TouchableOpacity className="mr-3 w-10 h-10 bg-white items-center justify-center rounded-full shadow-sm border border-[#F2EAE0]">
              <Feather name="search" size={20} color="#C2B8B2" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white items-center justify-center rounded-full shadow-sm border border-[#F2EAE0]">
              <Feather name="filter" size={20} color="#C2B8B2" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Text className="text-textMuted font-black text-[10px] uppercase tracking-[2px] pl-2 mb-6">Today's List</Text>
          
          <View className="gap-y-6">
            {habits.map((habit) => (
              <View key={habit.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#F2EAE0] mb-6 overflow-hidden relative">
                
                {/* Card Header with Tag */}
                <View className="flex-row justify-between items-center mb-5">
                   <View className="bg-card px-4 py-1.5 rounded-full border border-[#F2EAE0]">
                     <Text className="text-[10px] font-black text-textMuted uppercase tracking-widest">Health</Text>
                   </View>
                   <TouchableOpacity onPress={() => confirmDelete(habit.id, habit.title)}>
                     <View className="w-8 h-8 items-center justify-center bg-[#FFF2E0] rounded-full border border-[#FDE6C8]">
                       <Feather name="trash-2" size={16} color="#A04040" />
                     </View>
                   </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center flex-1">
                    <View className={`w-12 h-12 rounded-full justify-center items-center mr-4 bg-background border border-[#F2EAE0]`}>
                       <Feather name={habit.icon || "star"} size={22} color={habit.completed ? "#8C7A6B" : "#A04040"} />
                    </View>
                    <View className="flex-1">
                       <Text className="text-lg font-black text-textMain leading-tight">{habit.title}</Text>
                       <View className="flex-row items-center mt-1">
                         <Feather name="clock" size={10} color="#8C7A6B" />
                         <Text className="text-[10px] text-textMuted font-bold ml-1 uppercase tracking-wider">
                           {habit.duration || "Daily"} • {habit.start_time || "Anytime"}
                         </Text>
                       </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    onPress={() => !habit.completed && onStartHabit?.(habit)}
                    className={`${habit.completed ? 'bg-primary' : 'bg-primary shadow-lg shadow-primary/20'} px-6 py-3 rounded-2xl ml-4`}
                  >
                    <Text className="text-white text-[10px] font-black uppercase tracking-widest">
                      {habit.completed ? 'Done' : 'Start'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Progress Line */}
                <View className="h-1 w-full bg-background rounded-full mt-2 overflow-hidden">
                   <View 
                     className="h-full bg-primary"
                     style={{ width: habit.completed ? '100%' : `${(habit.streak || 1) * 10}%` }}
                   />
                </View>
              </View>
            ))}
          </View>
          <View className="pb-40"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
