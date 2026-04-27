import React, { useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Git-style heatmap component
 * @param {Array} data - Array of { date: 'YYYY-MM-DD', count: number }
 * @param {number} weeks - Number of weeks to show (default 26 for 6 months)
 */
export default function ContributionHeatmap({ data = [], weeks = 24 }) {
  const squareSize = 23;
  const daysInWeek = 7;
  const leftPadding = 35;
  const topPadding = 25;
  
  // Revert to a comfortable fixed margin so it's not too stretched
  const squareMargin = 22;
  
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

  // Just get the current month string once
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const renderGrid = () => {
    const elements = [];
    const today = new Date();
    
    // Start from 'weeks' ago, at the beginning of that week (Sunday)
    const startDate = new Date();
    startDate.setDate(today.getDate() - (weeks * 7) - today.getDay());

    for (let w = 0; w <= weeks; w++) {
      for (let d = 0; d < daysInWeek; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7) + d);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = dataMap[dateStr] || 0;
        
        const x = leftPadding + w * (squareSize + squareMargin);
        const y = topPadding + d * (squareSize + squareMargin);

        // Day labels (Left Axis) - render only on first week loop
        if (w === 0) {
          const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          elements.push(
            <SvgText
              key={`day-${d}`}
              x={0}
              y={y + squareSize / 1.5}
              fontSize="10"
              fill="#C2B8B2"
              fontWeight="bold"
            >
              {dayLabels[d]}
            </SvgText>
          );
        }

        // Week labels (Top Axis)
        if (d === 0) {
           elements.push(
             <SvgText
               key={`week-${w}`}
               x={x}
               y={topPadding - 8}
               fontSize="9"
               fill="#C2B8B2"
               fontWeight="900"
             >
               Week {w + 1}
             </SvgText>
           );
        }

        elements.push(
          <Rect
            key={`${w}-${d}`}
            x={x}
            y={y}
            width={squareSize}
            height={squareSize}
            rx={4}
            fill={getColor(count)}
          />
        );
      }
    }
    return elements;
  };

  const totalWidth = leftPadding + (weeks + 1) * (squareSize + squareMargin) + 20;
  const totalHeight = topPadding + daysInWeek * (squareSize + squareMargin);

  return (
    <View className="bg-white rounded-[32px] p-6 mb-8 border border-[#F2EAE0]">
      <Text className="text-[12px] font-black text-textMuted mb-6 uppercase tracking-[2px]">{currentMonth}</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="mt-2 mb-2"
      >
        <View className="overflow-hidden pr-6">
          <Svg width={Math.max(totalWidth, SCREEN_WIDTH - 80)} height={totalHeight}>
            {renderGrid()}
          </Svg>
        </View>
      </ScrollView>
      
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
