import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContributionHeatmap from '../components/ContributionHeatmap';
import WeeklyBarChart from '../components/WeeklyBarChart';
import { getDetailedStats, getHeatmapData } from '../api';

export default function OverallProgressScreen({ habits = [], statsRefreshKey = 0 }) {
  const [timeRange, setTimeRange] = useState('Weekly');
  const [detailedStats, setDetailedStats] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['Weekly', 'Monthly', 'Daily'];

  useEffect(() => {
    async function loadStats() {
      try {
        const [stats, heatmap] = await Promise.all([
          getDetailedStats(),
          getHeatmapData(),
        ]);
        setDetailedStats(stats);
        setHeatmapData(heatmap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [statsRefreshKey]); // refetch whenever a habit is completed

  // Total habits count — derived from detailedStats
  const totalHabits = detailedStats.length;

  // Aggregate all habit completions per day (sum across habits) for weekly bar
  const aggregatedHeatmap = React.useMemo(() => {
    const map = {};
    detailedStats.forEach((habitStat) => {
      habitStat.points.forEach(({ date, count }) => {
        map[date] = (map[date] || 0) + count;
      });
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [detailedStats]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FCF9F2' }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 28, paddingTop: 48 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Header */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#1B3022', letterSpacing: -0.5 }}>
            Habit Insights
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#8C7A6B', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>
            {timeRange} overview
          </Text>
        </View>

        {/* Tab Selector */}
        <View style={{
          flexDirection: 'row', backgroundColor: '#fff', borderRadius: 999,
          padding: 6, marginBottom: 32, borderWidth: 1, borderColor: '#F2EAE0',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
        }}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setTimeRange(tab)}
              style={{
                flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center',
                backgroundColor: timeRange === tab ? '#A04040' : 'transparent',
              }}
            >
              <Text style={{
                fontWeight: '800', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
                color: timeRange === tab ? '#fff' : '#8C7A6B',
              }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color="#A04040" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* ── WEEKLY: Aggregated bar chart (one bar per day) ── */}
            {timeRange === 'Weekly' && (
              <View>
                {detailedStats.length === 0 ? (
                  <EmptyState message="No habits yet. Add some habits to see your weekly progress!" />
                ) : (
                  <View style={{
                    backgroundColor: '#fff', borderRadius: 32, padding: 28,
                    borderWidth: 1, borderColor: '#F2EAE0',
                    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
                  }}>
                    {/* Header row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <View>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: '#1B3022', letterSpacing: -0.3 }}>
                          This Week
                        </Text>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#8C7A6B', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Overall completion rate
                        </Text>
                      </View>
                      {/* Quick stat badge */}
                      <View style={{
                        backgroundColor: '#FFF2E0', borderRadius: 20,
                        paddingHorizontal: 14, paddingVertical: 8,
                        borderWidth: 1, borderColor: '#FDE6C8',
                      }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#A04040', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {totalHabits} Habits
                        </Text>
                      </View>
                    </View>

                    {/* Aggregated bar chart — one bar per day, % = completions / totalHabits */}
                    <WeeklyBarChart data={aggregatedHeatmap} totalHabits={totalHabits} />
                  </View>
                )}
              </View>
            )}

            {/* ── MONTHLY: 4-week heatmap per habit ── */}
            {timeRange === 'Monthly' && (
              <View>
                {detailedStats.length === 0 ? (
                  <EmptyState message="No habits yet. Add some habits to see your monthly heatmap!" />
                ) : (
                  detailedStats.map((habitStat) => (
                    <View key={habitStat.habit_id} style={{
                      backgroundColor: '#fff', borderRadius: 32, padding: 24,
                      marginBottom: 20, borderWidth: 1, borderColor: '#F2EAE0',
                      shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{
                          width: 32, height: 32, borderRadius: 16,
                          backgroundColor: '#FFF2E0', alignItems: 'center', justifyContent: 'center', marginRight: 12,
                        }}>
                          <Text style={{ fontSize: 16 }}>📅</Text>
                        </View>
                        <Text style={{
                          fontSize: 12, fontWeight: '800', color: '#1B3022',
                          textTransform: 'uppercase', letterSpacing: 1, flex: 1,
                        }} numberOfLines={2}>
                          {habitStat.title}
                        </Text>
                      </View>
                      {/* 4 weeks only */}
                      <ContributionHeatmap data={habitStat.points} weeks={4} />
                    </View>
                  ))
                )}
              </View>
            )}

            {/* ── DAILY: Today's snapshot from live habits prop ── */}
            {timeRange === 'Daily' && (
              <View>
                <View style={{
                  backgroundColor: '#fff', borderRadius: 32, padding: 24,
                  marginBottom: 20, borderWidth: 1, borderColor: '#F2EAE0',
                  shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
                }}>
                  <Text style={{
                    fontSize: 10, fontWeight: '800', color: '#8C7A6B',
                    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
                  }}>
                    Today's Activity
                  </Text>
                  {habits.map((habit) => (
                    <View key={habit.id} style={{
                      flexDirection: 'row', alignItems: 'center',
                      paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2EAE0',
                    }}>
                      <View style={{
                        width: 8, height: 8, borderRadius: 4,
                        backgroundColor: habit.completed ? '#40C463' : '#E8DDD4',
                        marginRight: 12,
                      }} />
                      <Text style={{
                        flex: 1, fontSize: 13, fontWeight: '700', color: '#1B3022',
                      }} numberOfLines={1}>
                        {habit.title}
                      </Text>
                      <View style={{
                        paddingHorizontal: 10, paddingVertical: 4,
                        borderRadius: 999,
                        backgroundColor: habit.completed ? '#DCFCE7' : '#F2EAE0',
                      }}>
                        <Text style={{
                          fontSize: 10, fontWeight: '800',
                          color: habit.completed ? '#16A34A' : '#8C7A6B',
                          textTransform: 'uppercase', letterSpacing: 0.5,
                        }}>
                          {habit.completed ? '✓ Done' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {habits.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#8C7A6B', fontWeight: '600', paddingVertical: 16 }}>
                      No habits yet. Add habits to track your daily activity!
                    </Text>
                  )}
                </View>
              </View>
            )}
          </>
        )}

        {/* Motivation Card */}
        <View style={{
          backgroundColor: '#FFF8EE', borderRadius: 32, padding: 28,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 8, borderWidth: 1, borderColor: '#FDE6C8',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#B45309', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              Keep Going!
            </Text>
            <Text style={{ fontSize: 13, color: '#D97706', fontWeight: '600', lineHeight: 20 }}>
              Every day you show up is a victory. Stay consistent!
            </Text>
          </View>
          <View style={{
            marginLeft: 16, width: 56, height: 56, backgroundColor: '#fff',
            borderRadius: 28, alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: '#FDE6C8',
          }}>
            <Text style={{ fontSize: 28 }}>🌟</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({ message }) {
  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 32, padding: 40,
      alignItems: 'center', borderWidth: 1, borderColor: '#F2EAE0',
    }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>📊</Text>
      <Text style={{ fontSize: 13, color: '#8C7A6B', fontWeight: '600', textAlign: 'center', lineHeight: 20 }}>
        {message}
      </Text>
    </View>
  );
}
