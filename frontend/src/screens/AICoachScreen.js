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
    <SafeAreaView className="flex-1 bg-[#FCF9F2]">
      <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between mb-8 items-center px-2">
          <Text className="text-3xl font-extrabold text-[#3A2E28] tracking-tight">Focus Coach</Text>
          <View className="w-12 h-12 bg-[#FFF2E0] rounded-full items-center justify-center border border-[#FDE6C8] shadow-sm">
             <Text className="text-2xl">🤖</Text>
          </View>
        </View>

        {/* Suggestion Card */}
        <View className="bg-[#FF7A59] rounded-3xl p-6 mb-8 shadow-lg shadow-[#FF7A59]/20">
          <View className="flex-row items-center mb-4">
            <Feather name="zap" size={24} color="#FFFDFB" />
            <Text className="text-lg font-extrabold text-[#FFFDFB] ml-2 tracking-wide">Coach Suggests</Text>
          </View>
          <Text className="text-sm text-white/90 font-medium leading-relaxed mb-6">
            Based on your patterns, adding a 10-minute meditation after your morning water could increase your focus by 20%.
          </Text>
          <TouchableOpacity className="bg-white py-3 px-6 rounded-full self-start shadow-sm shadow-black/10">
            <Text className="text-[#FF7A59] font-extrabold uppercase tracking-widest text-[10px]">Add to Plan</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-[#A39081] font-bold text-xs uppercase tracking-widest pl-2 mb-4">Manage Habits</Text>

        {/* Manage List */}
        <View className="space-y-4">
          <View className="flex-row justify-between items-center bg-white p-5 rounded-3xl shadow-sm shadow-orange-900/5 border border-[#F2EAE0] mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#FCF9F2] rounded-full justify-center items-center border border-[#F2EAE0]">
                <Feather name="droplet" size={20} color="#FF7A59" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-extrabold text-[#3A2E28]">Drink Water</Text>
                <Text className="text-xs text-[#A39081] font-bold mt-1">8 glasses a day</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#F2EAE0", true: "#FF7A59" }}
              thumbColor={"#FFFDFB"}
              onValueChange={() => toggleSwitch('water')}
              value={toggles.water}
            />
          </View>

          <View className="flex-row justify-between items-center bg-white p-5 rounded-3xl shadow-sm shadow-orange-900/5 border border-[#F2EAE0] mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#FCF9F2] rounded-full justify-center items-center border border-[#F2EAE0]">
                <Feather name="coffee" size={20} color="#F59E0B" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-extrabold text-[#3A2E28]">Meditate</Text>
                <Text className="text-xs text-[#A39081] font-bold mt-1">10 mins Focus</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#F2EAE0", true: "#FF7A59" }}
              thumbColor={"#FFFDFB"}
              onValueChange={() => toggleSwitch('meditate')}
              value={toggles.meditate}
            />
          </View>

          <View className="flex-row justify-between items-center bg-white p-5 rounded-3xl shadow-sm shadow-orange-900/5 border border-[#F2EAE0] mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#FCF9F2] rounded-full justify-center items-center border border-[#F2EAE0]">
                <Feather name="activity" size={20} color="#E11D48" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-extrabold text-[#3A2E28]">Workout</Text>
                <Text className="text-xs text-[#A39081] font-bold mt-1">30 mins Daily</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#F2EAE0", true: "#FF7A59" }}
              thumbColor={"#FFFDFB"}
              onValueChange={() => toggleSwitch('workout')}
              value={toggles.workout}
            />
          </View>

        </View>
        <View className="pb-32"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
