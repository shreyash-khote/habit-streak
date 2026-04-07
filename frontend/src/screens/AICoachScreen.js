import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AICoachScreen() {
  const [toggles, setToggles] = useState({
    water: true,
    meditate: false,
    workout: true,
  });

  const toggleSwitch = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

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

        {/* Suggestion Card */}
        <View className="bg-primary rounded-[40px] p-8 mb-10 shadow-lg shadow-primary/20">
          <View className="flex-row items-center mb-5">
            <Feather name="zap" size={24} color="#FFFDFB" />
            <Text className="text-lg font-extrabold text-[#FFFDFB] ml-3 tracking-wide">Coach Suggests</Text>
          </View>
          <Text className="text-sm text-white/90 font-bold leading-relaxed mb-8">
            Based on your patterns, adding a 10-minute meditation after your morning water could increase your focus by 20%.
          </Text>
          <TouchableOpacity className="bg-white py-4 px-8 rounded-full self-start shadow-sm">
            <Text className="text-primary font-black uppercase tracking-widest text-[10px]">Add to Plan</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-textMuted font-black text-[10px] uppercase tracking-[2px] pl-2 mb-6">Manage Habits</Text>

        {/* Manage List */}
        <View className="gap-y-4">
          <View className="flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-[#F2EAE0] mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-background rounded-full justify-center items-center border border-[#F2EAE0]">
                <Feather name="droplet" size={20} color="#A04040" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-black text-textMain">Drink Water</Text>
                <Text className="text-xs text-textMuted font-bold mt-1">8 glasses a day</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#F2EAE0", true: "#A04040" }}
              thumbColor={"#FFFDFB"}
              onValueChange={() => toggleSwitch('water')}
              value={toggles.water}
            />
          </View>

          <View className="flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-[#F2EAE0] mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-background rounded-full justify-center items-center border border-[#F2EAE0]">
                <Feather name="coffee" size={20} color="#B45309" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-black text-textMain">Meditate</Text>
                <Text className="text-xs text-textMuted font-bold mt-1">10 mins Focus</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#F2EAE0", true: "#A04040" }}
              thumbColor={"#FFFDFB"}
              onValueChange={() => toggleSwitch('meditate')}
              value={toggles.meditate}
            />
          </View>

          <View className="flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-[#F2EAE0] mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-background rounded-full justify-center items-center border border-[#F2EAE0]">
                <Feather name="activity" size={20} color="#991B1B" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-black text-textMain">Workout</Text>
                <Text className="text-xs text-textMuted font-bold mt-1">30 mins Daily</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#F2EAE0", true: "#A04040" }}
              thumbColor={"#FFFDFB"}
              onValueChange={() => toggleSwitch('workout')}
              value={toggles.workout}
            />
          </View>

        </View>
        <View className="pb-40"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
