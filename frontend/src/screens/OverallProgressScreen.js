import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function OverallProgressScreen() {
  const [timeRange, setTimeRange] = useState('Monthly');
  const tabs = ['Weekly', 'Monthly', 'Daily'];

  // Dummy data
  const dataPoints = [3, 5, 2, 8, 4, 7, 5];

  return (
    <SafeAreaView className="flex-1 bg-[#FCF9F2]">
      <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8 px-2">
          <Text className="text-3xl font-extrabold text-[#3A2E28] tracking-tight">Your Progress</Text>
        </View>

        {/* Tab Selector */}
        <View className="flex-row bg-white rounded-full p-1 mb-8 shadow-sm border border-[#F2EAE0]">
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setTimeRange(tab)}
              className={`flex-1 py-3 rounded-full items-center ${timeRange === tab ? 'bg-[#FF7A59] shadow-sm' : 'bg-transparent'}`}
            >
              <Text className={`font-bold tracking-wide ${timeRange === tab ? 'text-white' : 'text-[#A39081]'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart Area */}
        <View className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-[#F2EAE0]">
          <Text className="text-sm font-bold text-[#6B5A52] mb-6 uppercase tracking-widest">Overall Average</Text>
          <View className="flex-row items-end justify-between h-48 pb-2">
            {dataPoints.map((val, idx) => (
              <View key={idx} className="w-8 items-center">
                <View 
                  className={`w-10 rounded-xl mb-2 ${idx === 3 ? 'bg-[#FF7A59] shadow-sm shadow-[#FF7A59]/40' : 'bg-[#FFF2E0]'}`} 
                  style={{ height: `${val * 10}%` }}
                />
                <Text className="text-[10px] text-[#A39081] font-bold">D{idx+1}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Highlight Card */}
        <View className="bg-[#FFF2E0] rounded-3xl p-6 flex-row items-center justify-between mb-24 shadow-sm border border-[#FDE6C8]">
          <View className="flex-1">
             <Text className="text-lg font-extrabold text-[#D97706] mb-1">Excellent!</Text>
             <Text className="text-xs text-[#B45309] font-medium leading-relaxed">Your monthly progress is up 15%. Keep the momentum going!</Text>
          </View>
          <Text className="text-5xl ml-4">🌟</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
