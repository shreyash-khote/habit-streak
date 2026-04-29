import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BAR_HEIGHT = 120;
const BAR_WIDTH = 28;

function AnimatedBar({ donePercent, isToday, label, index }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: donePercent,
      delay: index * 80,   // stagger bars left-to-right
      tension: 42,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [donePercent]);

  const barHeight = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, BAR_HEIGHT],
  });

  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      {/* % label above bar — always visible */}
      <Text style={{
        fontSize: 9, fontWeight: '800',
        color: donePercent > 0 ? (isToday ? '#A04040' : '#C88080') : '#D0C8C0',
        marginBottom: 4,
      }}>
        {`${Math.round(donePercent)}%`}
      </Text>

      {/* Track */}
      <View style={{
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        backgroundColor: '#F2EAE0',
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'flex-end',
      }}>
        {/* Animated fill rising from bottom */}
        <Animated.View style={{
          width: '100%',
          height: barHeight,
          backgroundColor: isToday ? '#A04040' : '#C88080',
          borderRadius: 8,
        }} />
      </View>

      {/* Day label */}
      <Text style={{
        fontSize: 9, fontWeight: '800',
        color: isToday ? '#A04040' : '#8C7A6B',
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        {label}
      </Text>

      {/* Today dot */}
      {isToday && (
        <View style={{
          width: 4, height: 4, borderRadius: 2,
          backgroundColor: '#A04040', marginTop: 2,
        }} />
      )}
    </View>
  );
}

/**
 * WeeklyBarChart — original style with spring rise animation
 * @param {Array}  data        - [{ date: 'YYYY-MM-DD', count: number }]
 * @param {number} totalHabits - total habits for % calculation
 */
export default function WeeklyBarChart({ data = [], totalHabits = 1 }) {
  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {});

  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = dataMap[dateStr] || 0;
    const total = Math.max(totalHabits, 1);
    days.push({
      label: DAY_LABELS[d.getDay()],
      dateStr,
      donePercent: Math.min((count / total) * 100, 100),
      isToday: i === 0,
    });
  }

  return (
    <View style={{ paddingVertical: 8 }}>
      {/* Bar chart */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        {days.map((day, index) => (
          <AnimatedBar
            key={day.dateStr}
            donePercent={day.donePercent}
            isToday={day.isToday}
            label={day.label}
            index={index}
          />
        ))}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#A04040', marginRight: 4 }} />
          <Text style={{ fontSize: 9, fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', letterSpacing: 1 }}>Done</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#F2EAE0', marginRight: 4, borderWidth: 1, borderColor: '#E8DDD4' }} />
          <Text style={{ fontSize: 9, fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', letterSpacing: 1 }}>Not Done</Text>
        </View>
      </View>
    </View>
  );
}
