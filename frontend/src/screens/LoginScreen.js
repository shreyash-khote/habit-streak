import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

export default function LoginScreen({ onLogin, onNavigateToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      if (Platform.OS === 'web') alert('Please enter both email and password.');
      else Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    
    try {
      // Use Firebase auth to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Once signed in, call onLogin
      onLogin(userCredential.user);
    } catch (error) {
      if (Platform.OS === 'web') alert('Login failed: ' + error.message);
      else Alert.alert('Login failed', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Unsupported', 'Google Sign-In is currently only supported on the Web version.');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (error) {
      alert('Google Login failed: ' + error.message);
    }
  };

  return (
    <View className="flex-1 bg-[#FCF9F2]">
      {/* Top half with leaf logo */}
      <View className="flex-[0.35] items-center justify-center">
        {/* Simple CSS leaf logo placeholder matching the image */}
        <View className="flex-row items-end">
          <View className="w-12 h-12 bg-[#8DBB45] rounded-tl-full rounded-br-full transform -rotate-[30deg] mr-1 mb-2" />
          <View className="w-16 h-16 bg-[#0E7951] rounded-tr-full rounded-bl-full" />
        </View>
      </View>

      {/* Bottom green half with form */}
      <View className="flex-[0.65] bg-[#0E7951] rounded-tl-[120px] pt-12 px-8">
        <Text className="text-white text-3xl font-bold text-center mb-8">Log In</Text>

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

        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity className="flex-row items-center">
            <View className="w-5 h-5 bg-[#FCF9F2] rounded justify-center items-center mr-2">
              <Feather name="check" size={14} color="#0E7951" />
            </View>
            <Text className="text-white text-sm">Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-[#F08B9B] text-sm font-semibold">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          className="bg-[#181211] py-4 rounded-xl items-center mb-6"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg">Log In</Text>
        </TouchableOpacity>

        <Text className="text-white text-center text-sm mb-4">Or Sign In with</Text>
        <View className="flex-row justify-center space-x-6 mb-8">
          <TouchableOpacity className="w-10 h-10 bg-[#1877F2] rounded-full justify-center items-center mr-4">
            <FontAwesome5 name="facebook-f" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-10 h-10 bg-white rounded-full justify-center items-center mr-4"
            onPress={handleGoogleLogin}
          >
            <FontAwesome5 name="google" size={20} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-black rounded-full justify-center items-center">
            <FontAwesome5 name="apple" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-auto pb-8">
          <Text className="text-white">Don't have an account? </Text>
          <TouchableOpacity onPress={onNavigateToSignUp}>
            <Text className="text-[#F08B9B] font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
