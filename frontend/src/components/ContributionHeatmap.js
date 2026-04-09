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
    if (!count || count === 0) return '#EBEDF0'; // Empty state (GitHub Light Gray)
    if (count === 1) return '#9BE9A8'; // Light Green
    if (count === 2) return '#40C463'; // Medium Green
    if (count === 3) return '#30A14E'; // Dark Green
    if (count >= 4) return '#216E39'; // Deepest Green (App Theme)
    return '#EBEDF0';
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
    <View className="bg-white rounded-[32px] p-6 mb-8 border border-[#F2EAE0]">
      <Text className="text-[10px] font-black text-textMuted mb-6 uppercase tracking-[2px]">Commitment Heatmap</Text>
      
      <View className="overflow-hidden">
        <Svg width={totalWidth} height={totalHeight}>
          {renderGrid()}
        </Svg>
      </View>
      
      <View className="flex-row items-center justify-between mt-6">
        <View className="flex-row items-center">
            <Text className="text-[9px] font-bold text-textMuted mr-2">Less</Text>
            {[0, 1, 2, 3, 4].map(v => (
                <View 
                    key={v} 
                    style={{ backgroundColor: getColor(v), width: 8, height: 8, marginRight: 2, borderRadius: 1 }} 
                />
            ))}
            <Text className="text-[9px] font-bold text-textMuted ml-1">More</Text>
        </View>
        <Text className="text-[9px] font-black text-textMuted uppercase tracking-widest">Last {weeks} Weeks</Text>
      </View>
    </View>
  );
}
