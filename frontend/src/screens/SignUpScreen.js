import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function SignUpScreen({ onSignUp, onNavigateToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      const msg = 'Please fill all required fields.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optional: Update profile with firstName and lastName
      onSignUp(userCredential.user);
    } catch (error) {
      Platform.OS === 'web' ? alert('Sign up failed: ' + error.message) : Alert.alert('Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-[#FCF9F2]">
      {/* Header */}
      <View className="flex-row items-center pt-14 pb-8 px-6">
        <TouchableOpacity onPress={onNavigateToLogin}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-3xl font-bold pr-6">Sign Up</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-[#0E7951] rounded-tl-[120px] pt-12 px-8">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="bg-[#FCF9F2] rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-black font-bold mb-1">First Name</Text>
            <TextInput
              className="text-black text-base pb-1"
              placeholder="John"
              placeholderTextColor="#A0A0A0"
              value={firstName}
              onChangeText={setFirstName}
              style={Platform.OS === 'web' ? { outline: 'none' } : {}}
            />
          </View>

          <View className="bg-[#FCF9F2] rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-black font-bold mb-1">Last Name</Text>
            <TextInput
              className="text-black text-base pb-1"
              placeholder="Doe"
              placeholderTextColor="#A0A0A0"
              value={lastName}
              onChangeText={setLastName}
              style={Platform.OS === 'web' ? { outline: 'none' } : {}}
            />
          </View>

          <View className="bg-[#FCF9F2] rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-black font-bold mb-1">Email</Text>
            <TextInput
              className="text-black text-base pb-1"
              placeholder="johndoe@xyz.com"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={Platform.OS === 'web' ? { outline: 'none' } : {}}
            />
          </View>

          <View className="bg-[#FCF9F2] rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-black font-bold mb-1">Password</Text>
            <TextInput
              className="text-black text-base pb-1"
              placeholder="***************"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={Platform.OS === 'web' ? { outline: 'none' } : {}}
            />
          </View>

          <View className="bg-[#FCF9F2] rounded-xl px-4 py-3 mb-8">
            <Text className="text-sm text-black font-bold mb-1">Confirm Password</Text>
            <TextInput
              className="text-black text-base pb-1"
              placeholder="***************"
              placeholderTextColor="#A0A0A0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={Platform.OS === 'web' ? { outline: 'none' } : {}}
            />
          </View>

          <TouchableOpacity 
            className="bg-[#181211] py-4 rounded-xl items-center mb-6"
            onPress={handleSignUp}
          >
            <Text className="text-white font-bold text-lg">Sign Up</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-white">Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text className="text-[#F08B9B] font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
