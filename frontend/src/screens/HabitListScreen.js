import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function HabitListScreen({ habits = [], onStartHabit }) {
  return (
    <SafeAreaView className="flex-1 bg-[#FCF9F2]">
      <View className="flex-1 px-4 pt-10 relative">
        {/* Header */}
        <View className="w-full flex-row justify-between mb-8 items-center px-2">
          <Text className="text-3xl font-extrabold text-[#3A2E28] tracking-tight">Your Habits</Text>
          <View className="flex-row">
            <TouchableOpacity className="mr-4 w-10 h-10 bg-white items-center justify-center rounded-full shadow-sm shadow-orange-900/5">
              <Feather name="search" size={20} color="#C2B8B2" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white items-center justify-center rounded-full shadow-sm shadow-orange-900/5">
              <Feather name="filter" size={20} color="#C2B8B2" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Text className="text-[#A39081] font-bold text-xs uppercase tracking-widest pl-2 mb-4">Today's List</Text>
          <View className="space-y-4">
            {habits.map((habit) => (
              <View key={habit.id} className="bg-white rounded-3xl p-5 shadow-sm shadow-orange-900/5 border border-[#F2EAE0] mb-4 relative overflow-hidden">
                {habit.completed && (
                   <View className="absolute top-0 right-0 h-full w-2 bg-[#F59E0B]"></View>
                )}
                
                <View className="flex-row justify-between items-center mb-3">
                   <Text className="bg-[#FFFDFB] px-3 py-1 rounded-full text-xs font-bold text-[#A39081] border border-[#F2EAE0]">
                     Health
                   </Text>
                   <TouchableOpacity>
                     <Feather name="more-horizontal" size={20} color="#C2B8B2" />
                   </TouchableOpacity>
                </View>

                {habit.completed || habit.type === 'progress' ? (
                   <View className="mt-2">
                     <View className="flex-row items-center mb-3">
                         <View className="w-10 h-10 bg-[#FEF3C7] rounded-full justify-center items-center mr-3">
                            <Feather name="check" size={20} color="#D97706" />
                         </View>
                         <View className="flex-1">
                            <Text className="text-base font-extrabold text-[#3A2E28]">{habit.title}</Text>
                            <Text className="text-xs text-[#A39081] font-medium">{habit.subtitle}</Text>
                         </View>
                         <View className="bg-[#F59E0B] px-3 py-1 rounded-lg">
                            <Text className="text-[#FFFDFB] text-[10px] font-bold uppercase tracking-widest">Done</Text>
                         </View>
                     </View>
                     {habit.progress !== undefined && (
                        <View className="h-2 w-full bg-[#F2EAE0] rounded-full mt-2 overflow-hidden">
                           <View style={{ width: `${habit.progress * 100}%` }} className="h-full bg-[#F59E0B]"></View>
                        </View>
                     )}
                   </View>
                ) : (
                   <View className="flex-row justify-between items-center mt-2">
                     <View className="w-12 h-12 rounded-full bg-[#FCF9F2] border border-[#F2EAE0] justify-center items-center mr-4">
                        <Feather name={habit.icon || "star"} size={20} color="#FF7A59" />
                     </View>
                     <View className="flex-1">
                        <Text className="text-base font-extrabold text-[#3A2E28]">{habit.title}</Text>
                        <Text className="text-xs text-[#6B5A52] mb-1 font-bold">{habit.subtitle}</Text>
                     </View>
                     <TouchableOpacity 
                        onPress={() => onStartHabit?.(habit)}
                        className="bg-[#FF7A59] px-5 py-3 rounded-xl ml-2 shadow-sm shadow-[#FF7A59]/20"
                     >
                        <Text className="text-white text-xs font-bold uppercase tracking-widest">Start</Text>
                     </TouchableOpacity>
                   </View>
                )}
              </View>
            ))}
          </View>
          <View className="pb-32"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
