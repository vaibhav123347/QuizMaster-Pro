import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#0b1120',
  border: '1px solid rgba(56, 189, 248, 0.35)',
  borderRadius: '10px',
  color: '#f1f5f9',
  fontSize: '12px',
};

export const ScoreTrendChart: React.FC<{
  data: Array<{ quiz: string; score: number }>;
}> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted py-5 small">
        Attempt quizzes to see your score progression chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
        <XAxis dataKey="quiz" stroke="#94a3b8" fontSize={11} />
        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="score"
          name="Score (%)"
          stroke="#06b6d4"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#scoreAreaGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const CategoryBarChart: React.FC<{
  data: Array<{ name: string; avgScore: number; color?: string; attempts?: number }>;
}> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted py-5 small">
        No category analytics data recorded yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="avgScore" name="Avg Score (%)" radius={[6, 6, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color || '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AttemptsVolumeChart: React.FC<{
  data: Array<{ date: string; attempts: number; avgScore: number }>;
}> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted py-5 small">
        No quiz attempt activity recorded yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
        <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="attempts" name="Submissions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
