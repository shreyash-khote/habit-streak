import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCoachBreakdown } from '../api';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseSuggestions = (text) =>
  text
    .split('\n')
    .map((l) => l.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

// ─── Dot Grid Background ─────────────────────────────────────────────────────

function DotGrid() {
  const cols = Math.ceil(SCREEN_W / 28);
  const rows = 28;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }} pointerEvents="none">
      {Array.from({ length: rows }).map((_, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <View
              key={c}
              style={{
                width: 28, height: 28,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <View style={{
                width: 2, height: 2, borderRadius: 1,
                backgroundColor: 'rgba(160, 100, 220, 0.18)',
              }} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Sparkle Icon ─────────────────────────────────────────────────────────────

function SparkleIcon({ size = 20, color = '#c26ef7' }) {
  return (
    <Text style={{ fontSize: size, color, lineHeight: size + 4 }}>✦</Text>
  );
}

// ─── Animated Progress Bar ────────────────────────────────────────────────────

function AnimatedProgressBar({ visible }) {
  const anim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (visible) {
      const loop = Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );
      anim.setValue(-1);
      loop.start();
      return () => loop.stop();
    } else {
      anim.setValue(-1);
    }
  }, [visible]);

  if (!visible) return null;

  const translateX = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={{
      height: 3,
      backgroundColor: 'rgba(194, 110, 247, 0.15)',
      borderRadius: 99,
      overflow: 'hidden',
      marginHorizontal: 32,
      marginTop: 6,
    }}>
      <Animated.View style={{
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        borderRadius: 99,
        transform: [{ translateX }],
      }}>
        <LinearGradient
          colors={['transparent', '#c26ef7', '#f472b6', 'transparent']}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={{ flex: 1, borderRadius: 99 }}
        />
      </Animated.View>
    </View>
  );
}

// ─── Neumorphic Search / Input Bar ────────────────────────────────────────────

function SearchBar({ value, onChange, onSubmit, loading, onClear }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ paddingHorizontal: 24, marginTop: 8 }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.82)',
        borderRadius: 999,
        paddingHorizontal: 20,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        // neumorphic shadow
        shadowColor: '#c26ef7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: focused ? 0.22 : 0.1,
        shadowRadius: 24,
        elevation: 10,
        borderWidth: 1.5,
        borderColor: focused ? 'rgba(194,110,247,0.35)' : 'rgba(255,255,255,0.9)',
      }}>
        {/* Sparkle / AI icon */}
        <View style={{ marginRight: 10 }}>
          <SparkleIcon size={18} color={focused ? '#c26ef7' : '#b89fd8'} />
        </View>

        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Type to Search or Generate..."
          placeholderTextColor="rgba(160,120,200,0.55)"
          style={{
            flex: 1,
            fontSize: 15,
            color: '#3d2060',
            fontWeight: '500',
            outline: 'none',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          multiline={false}
        />

        {/* Clear / send button */}
        {(value.length > 0 || loading) && (
          <TouchableOpacity
            onPress={loading ? undefined : onClear}
            style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: 'rgba(194,110,247,0.12)',
              alignItems: 'center', justifyContent: 'center',
              marginLeft: 8,
            }}>
            {loading
              ? <ActivityIndicator size="small" color="#c26ef7" />
              : <Feather name="x" size={14} color="#c26ef7" />}
          </TouchableOpacity>
        )}
      </View>

      {/* Animated progress bar below the pill */}
      <AnimatedProgressBar visible={loading} />
    </View>
  );
}

// ─── Suggestion Card ──────────────────────────────────────────────────────────

function SuggestionCard({ text, index, onAdd, added }) {
  const icons = ['zap', 'sun', 'activity', 'heart', 'star', 'coffee', 'droplet', 'moon'];
  const icon = icons[index % icons.length];
  const gradients = [
    ['#f3e8ff', '#fce7f3'],
    ['#ede9fe', '#fdf2f8'],
    ['#faf5ff', '#fff1f2'],
    ['#f5f3ff', '#fce7f3'],
  ];
  const [g1, g2] = gradients[index % gradients.length];

  return (
    <View style={{
      borderRadius: 20,
      marginBottom: 10,
      overflow: 'hidden',
      shadowColor: '#c26ef7',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    }}>
      <LinearGradient
        colors={[g1, g2]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 14,
          borderWidth: 1,
          borderColor: 'rgba(194,110,247,0.15)',
          borderRadius: 20,
        }}>
        <View style={{
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: 'rgba(194,110,247,0.15)',
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Feather name={icon} size={16} color="#a855f7" />
        </View>
        <Text style={{ flex: 1, fontSize: 13, color: '#3d2060', fontWeight: '600', lineHeight: 20 }}>{text}</Text>
        <TouchableOpacity
          onPress={() => !added && onAdd(text)}
          style={{
            borderRadius: 20,
            paddingHorizontal: 12, paddingVertical: 6,
            marginLeft: 8,
            overflow: 'hidden',
          }}>
          {added ? (
            <View style={{ backgroundColor: 'rgba(168,85,247,0.12)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: '#a855f7', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 }}>✓ ADDED</Text>
            </View>
          ) : (
            <LinearGradient
              colors={['#c26ef7', '#f472b6']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 }}>+ ADD</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────

function ChatBubble({ msg, onAddHabit, addedHabits }) {
  const isUser = msg.role === 'user';
  return (
    <View style={{ marginBottom: 18, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <LinearGradient
            colors={['#c26ef7', '#f472b6']}
            style={{
              width: 26, height: 26, borderRadius: 13,
              alignItems: 'center', justifyContent: 'center',
              marginRight: 7,
            }}>
            <Text style={{ fontSize: 12 }}>✦</Text>
          </LinearGradient>
          <Text style={{ fontSize: 11, color: '#a855f7', fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>
            AI Coach
          </Text>
        </View>
      )}

      {isUser ? (
        <LinearGradient
          colors={['#c26ef7', '#f472b6']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 22, borderBottomRightRadius: 6,
            paddingHorizontal: 16, paddingVertical: 12, maxWidth: '80%',
          }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{msg.content}</Text>
        </LinearGradient>
      ) : (
        <View style={{ maxWidth: '94%' }}>
          {msg.intro && (
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 20, borderBottomLeftRadius: 6,
              paddingHorizontal: 16, paddingVertical: 12, marginBottom: 10,
              borderWidth: 1, borderColor: 'rgba(194,110,247,0.15)',
              shadowColor: '#c26ef7', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
            }}>
              <Text style={{ color: '#3d2060', fontSize: 14, fontWeight: '500', lineHeight: 22 }}>{msg.intro}</Text>
            </View>
          )}
          {msg.suggestions?.map((s, i) => (
            <SuggestionCard
              key={i} text={s} index={i}
              onAdd={onAddHabit} added={addedHabits.has(s)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Quick Prompt Chip ────────────────────────────────────────────────────────

function QuickChip({ label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'rgba(255,255,255,0.72)',
        borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8,
        borderWidth: 1, borderColor: 'rgba(194,110,247,0.25)',
        flexDirection: 'row', alignItems: 'center', gap: 6,
        shadowColor: '#c26ef7', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
        marginRight: 8,
      }}>
      <SparkleIcon size={11} color="#c26ef7" />
      <Text style={{ fontSize: 12, color: '#6d28d9', fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AICoachScreen({ onAddHabit }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedHabits, setAddedHabits] = useState(new Set());
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      intro: `${getGreeting()}! ✦  I'm your AI Coach.\n\nDescribe a goal — like "sleep better", "get fit", or "read more" — and I'll craft daily micro-habits tailored just for you.`,
      suggestions: [],
    },
  ]);

  const scrollRef = useRef(null);

  const scrollToBottom = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const data = await getCoachBreakdown(trimmed);
      const raw = data?.suggestion || 'I could not get a response. Please try again.';
      const lines = parseSuggestions(raw);
      const intro = lines.length > 0
        ? `Here are micro-habits to help you "${trimmed}" 🎯`
        : raw;
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', intro, suggestions: lines.length > 0 ? lines : [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', intro: 'Oops! Could not reach the server. Please check your connection.', suggestions: [] },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleAddHabit = (habitText) => {
    if (addedHabits.has(habitText)) return;
    setAddedHabits((prev) => new Set([...prev, habitText]));
    onAddHabit?.({ title: habitText, category: 'Health', frequency_type: 'daily' });
    if (Platform.OS !== 'web') {
      Alert.alert('✅ Added!', `"${habitText.slice(0, 50)}…" has been added to your habits.`);
    }
  };

  const quickPrompts = ['Morning routine', 'Read every day', 'Get fit at home', 'Sleep better'];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* ── Gradient Background ── */}
      <LinearGradient
        colors={['#f8f0ff', '#fce4f6', '#fff1f8', '#f5f0ff']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <DotGrid />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}>

        {/* ── Header ── */}
        <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 6, paddingHorizontal: 24 }}>
          {/* Badge */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(194,110,247,0.12)',
            borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6,
            marginBottom: 10,
            borderWidth: 1, borderColor: 'rgba(194,110,247,0.2)',
          }}>
            <SparkleIcon size={12} color="#c26ef7" />
            <Text style={{ fontSize: 11, color: '#a855f7', fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>
              AI-Powered Adaptive Coach
            </Text>
          </View>

          <Text style={{
            fontSize: 28, fontWeight: '800', textAlign: 'center',
            letterSpacing: -0.5,
            color: 'transparent',
          }}>
            {/* Gradient text via a LinearGradient overlay trick */}
          </Text>
          {/* Gradient title */}
          <View>
            <Text style={{
              fontSize: 26, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5,
              color: '#6d28d9',
            }}>
              AI-Powered Habit
            </Text>
            <Text style={{
              fontSize: 26, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5,
              color: '#d946a8',
            }}>
              Generation
            </Text>
          </View>
        </View>

        {/* ── Search / Input pill ── */}
        <SearchBar
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          loading={loading}
          onClear={() => setInput('')}
        />

        {/* ── Quick Prompts ── */}
        {messages.length <= 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 14, paddingBottom: 4 }}>
            {quickPrompts.map((p) => (
              <QuickChip key={p} label={p} onPress={() => setInput(p)} />
            ))}
          </ScrollView>
        )}

        {/* ── Messages ── */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id} msg={msg}
              onAddHabit={handleAddHabit} addedHabits={addedHabits}
            />
          ))}

          {/* Typing indicator */}
          {loading && (
            <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <LinearGradient
                  colors={['#c26ef7', '#f472b6']}
                  style={{ width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 7 }}>
                  <Text style={{ fontSize: 12 }}>✦</Text>
                </LinearGradient>
                <Text style={{ fontSize: 11, color: '#a855f7', fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>AI Coach</Text>
              </View>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.75)',
                borderRadius: 20, borderBottomLeftRadius: 6,
                paddingHorizontal: 20, paddingVertical: 14,
                borderWidth: 1, borderColor: 'rgba(194,110,247,0.15)',
                flexDirection: 'row', alignItems: 'center', gap: 10,
              }}>
                <ActivityIndicator size="small" color="#c26ef7" />
                <Text style={{ fontSize: 13, color: '#a855f7', fontWeight: '600' }}>Generating your plan…</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Send Button (floating, below search on mobile) ── */}
        {input.trim().length > 0 && (
          <View style={{ paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 16 : 12 }}>
            <TouchableOpacity onPress={handleSend} disabled={loading} style={{ borderRadius: 999, overflow: 'hidden' }}>
              <LinearGradient
                colors={['#c26ef7', '#f472b6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  paddingVertical: 14, borderRadius: 999, gap: 8,
                }}>
                <SparkleIcon size={14} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 }}>
                  Generate Habit Plan
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
