import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { HistoricalDataPoint } from '../services/metalsApi';

const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MetalIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

interface PriceTrendChartProps {
  data: HistoricalDataPoint[];
  title: string;
  icon: string;
  color: string;
  height?: number;
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ 
  data, 
  title, 
  icon, 
  color, 
  height = 300 
}) => {
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '5px',
          color: '#fff'
        }}>
          <p>{formatTooltipDate(label)}</p>
          <p style={{ color: color }}>
            {title}: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Simplify data for better performance (show every 5th point)
  const simplifiedData = data.filter((_, index) => index % 5 === 0);

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ChartHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MetalIcon>{icon}</MetalIcon>
          <ChartTitle>{title} Price Trend (1 Year)</ChartTitle>
        </div>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={simplifiedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.1)" 
          />
          
          <XAxis 
            dataKey="date"
            tick={{ fill: '#fff', fontSize: 10 }}
            tickFormatter={formatDate}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          
          <YAxis 
            tick={{ fill: '#fff', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fillOpacity={1}
            fill={`url(#color${title})`}
            strokeWidth={2}
          />
          
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ 
        textAlign: 'center', 
        color: '#888', 
        fontSize: '0.8rem',
        marginTop: '0.5rem'
      }}>
        {data.length} trading days | Last update: {new Date().toLocaleDateString()}
      </div>
    </ChartContainer>
  );
};

export default PriceTrendChart;