import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { getCoachBreakdown } from '../api';

export default function AICoachScreen() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('Based on your patterns, adding a 10-minute meditation after your morning water could increase your focus by 20%.');

  const handleAskCoach = async () => {
    if (!goal.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const res = await getCoachBreakdown(goal);
      setSuggestion(res.suggestion || "I'm not sure how to break that down.");
    } catch (e) {
      setSuggestion("Sorry, I'm having trouble connecting right now.");
    } finally {
      setLoading(false);
      setGoal('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-8 pt-12" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between mb-10 items-center px-1">
          <Text className="text-3xl font-black text-textMain tracking-tight">Focus Coach</Text>
          <View className="w-12 h-12 bg-[#FFF2E0] rounded-full items-center justify-center border border-[#FDE6C8] shadow-sm">
             <Text className="text-2xl">🤖</Text>
          </View>
        </View>

        <Text className="text-textMuted font-black text-[10px] uppercase tracking-[2px] pl-2 mb-6">Ask True Coach</Text>

        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-[#F2EAE0] mb-10">
          <Text className="text-base font-black text-textMain mb-4">What's your big goal?</Text>
          <View className="bg-background rounded-2xl px-4 py-3 border border-[#F2EAE0] mb-4">
             <TextInput 
               value={goal}
               onChangeText={setGoal}
               placeholder="E.g., I want to run a marathon"
               placeholderTextColor="#A39081"
               className="text-sm text-textMain font-bold min-h-[40px]"
               multiline
             />
          </View>
          <TouchableOpacity 
            onPress={handleAskCoach}
            disabled={loading || !goal.trim()}
            className={`${loading || !goal.trim() ? 'bg-primary/50' : 'bg-primary'} py-4 rounded-full items-center shadow-lg shadow-primary/20`}
          >
            <Text className="text-white font-black uppercase tracking-widest text-[10px]">
              {loading ? 'Thinking...' : 'Break it down'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Suggestion Card */}
        <View className="bg-primary rounded-[40px] p-8 mb-4 shadow-lg shadow-primary/20">
          <View className="flex-row items-center mb-5">
            <Feather name="zap" size={24} color="#FFFDFB" />
            <Text className="text-lg font-extrabold text-[#FFFDFB] ml-3 tracking-wide">Coach Suggests</Text>
          </View>
          {loading ? (
            <ActivityIndicator color="#FFFDFB" className="mb-8" />
          ) : (
            <Text className="text-sm text-white/90 font-bold leading-relaxed mb-8">
              {suggestion}
            </Text>
          )}
          <TouchableOpacity className="bg-white py-4 px-8 rounded-full self-start shadow-sm">
            <Text className="text-primary font-black uppercase tracking-widest text-[10px]">Add to Plan</Text>
          </TouchableOpacity>
        </View>
        
        <View className="pb-40"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
