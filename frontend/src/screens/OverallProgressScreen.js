import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function OverallProgressScreen() {
  const [timeRange, setTimeRange] = useState('Monthly');
  const tabs = ['Weekly', 'Monthly', 'Daily'];

  // Dummy data as seen in mockup
  const dataPoints = [3, 5, 2, 8, 4, 7, 5];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
         className="flex-1 px-8 pt-12" 
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Header */}
        <View className="mb-10">
          <Text className="text-3xl font-black text-textMain tracking-tight">Your Progress</Text>
        </View>

        {/* Tab Selector Segmented Control */}
        <View className="flex-row bg-white rounded-full p-2 mb-10 shadow-sm border border-[#F2EAE0]">
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setTimeRange(tab)}
              className={`flex-1 py-3 rounded-full items-center ${timeRange === tab ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-transparent'}`}
            >
              <Text className={`font-black text-xs uppercase tracking-widest ${timeRange === tab ? 'text-white' : 'text-textMuted'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart Hero Card */}
        <View className="bg-white rounded-[40px] p-8 mb-10 shadow-sm border border-[#F2EAE0]">
          <Text className="text-[10px] font-black text-textMuted mb-10 uppercase tracking-[2px]">Overall Average</Text>
          <View className="flex-row items-end justify-between h-52 pb-4">
            {dataPoints.map((val, idx) => (
              <View key={idx} className="items-center">
                <View 
                  className={`w-10 rounded-2xl mb-4 ${idx === 3 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-[#FFF2E0]'}`} 
                  style={{ height: `${val * 10}%` }}
                />
                <Text className="text-[10px] text-textMuted font-black">D{idx+1}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Motivation Card */}
        <View className="bg-accent rounded-[40px] p-8 flex-row items-center justify-between shadow-sm border border-[#FDE6C8]">
          <View className="flex-1">
             <Text className="text-xl font-black text-[#B45309] mb-2 uppercase tracking-wide">Excellent!</Text>
             <Text className="text-sm text-[#D97706] font-bold leading-relaxed">
               Your monthly progress is up 15%. Keep the momentum going!
             </Text>
          </View>
          <View className="ml-4 w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg shadow-orange-900/10 border border-[#FDE6C8]">
             <Text className="text-4xl text-[#FBBF24]">🌟</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
