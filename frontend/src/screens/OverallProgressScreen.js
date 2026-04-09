import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { getHeatmapData } from '../api';

export default function OverallProgressScreen() {
  const [timeRange, setTimeRange] = useState('Monthly');
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['Weekly', 'Monthly', 'Daily'];

  useEffect(() => {
    async function loadStats() {
      try {
        const hData = await getHeatmapData();
        setHeatmapData(hData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
         className="flex-1 px-8 pt-12" 
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Header */}
        <View className="mb-10">
          <Text className="text-3xl font-black text-textMain tracking-tight">Activity Stats</Text>
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

        {/* Heatmap Section */}
        {loading ? (
             <ActivityIndicator color="#A04040" className="mb-10" />
        ) : (
            <ContributionHeatmap data={heatmapData} weeks={20} />
        )}

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
