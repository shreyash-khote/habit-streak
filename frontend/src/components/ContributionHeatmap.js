import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Git-style heatmap component
 * @param {Array} data - Array of { date: 'YYYY-MM-DD', count: number }
 * @param {number} weeks - Number of weeks to show (default 26 for 6 months)
 */
export default function ContributionHeatmap({ data = [], weeks = 24 }) {
  const squareSize = 10;
  const squareMargin = 3;
  const daysInWeek = 7;
  
  // Create a map for quick lookup
  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {});

  // Function to get color based on count
  const getColor = (count) => {
    if (!count || count === 0) return '#DCF5E2'; // Very light green (empty state)
    if (count === 1) return '#9BE9A8'; // Light green
    if (count === 2) return '#40C463'; // Medium green
    if (count === 3) return '#30A14E'; // Dark green
    if (count >= 4) return '#216E39'; // Deepest green
    return '#DCF5E2';
  };

  const renderGrid = () => {
    const grid = [];
    const today = new Date();
    
    // Start from 'weeks' ago, at the beginning of that week (Sunday)
    const startDate = new Date();
    startDate.setDate(today.getDate() - (weeks * 7) - today.getDay());

    for (let w = 0; w <= weeks; w++) {
      const weekSquares = [];
      for (let d = 0; d < daysInWeek; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7) + d);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = dataMap[dateStr] || 0;
        
        weekSquares.push(
          <Rect
            key={`${w}-${d}`}
            x={w * (squareSize + squareMargin)}
            y={d * (squareSize + squareMargin)}
            width={squareSize}
            height={squareSize}
            rx={2}
            fill={getColor(count)}
          />
        );
      }
      grid.push(weekSquares);
    }
    return grid;
  };

  const totalWidth = (weeks + 1) * (squareSize + squareMargin);
  const totalHeight = daysInWeek * (squareSize + squareMargin);

  return (
    <View style={{ paddingVertical: 4 }}>
      <Text style={{
        fontSize: 10, fontWeight: '800', color: '#8C7A6B',
        letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12,
      }}>
        Commitment Heatmap
      </Text>

      <View style={{ overflow: 'hidden' }}>
        <Svg width={totalWidth} height={totalHeight}>
          {renderGrid()}
        </Svg>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 9, fontWeight: '700', color: '#8C7A6B', marginRight: 4 }}>Less</Text>
          {[0, 1, 2, 3, 4].map(v => (
            <View key={v} style={{ backgroundColor: getColor(v), width: 8, height: 8, marginRight: 2, borderRadius: 1 }} />
          ))}
          <Text style={{ fontSize: 9, fontWeight: '700', color: '#8C7A6B', marginLeft: 2 }}>More</Text>
        </View>
        <Text style={{ fontSize: 9, fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', letterSpacing: 1 }}>
          Last {weeks} Weeks
        </Text>
      </View>
    </View>
  );
}
