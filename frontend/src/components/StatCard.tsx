import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = '#38bdf8',
}) => {
  return (
    <div className="qm-card qm-card-hover p-3 p-md-4 h-100">
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div>
          <div className="text-secondary small fw-medium mb-1">{title}</div>
          <div className="fs-3 fw-bold text-white font-display">{value}</div>
          {subtitle && (
            <div className="text-muted small mt-1" style={{ fontSize: '0.78rem' }}>
              {subtitle}
            </div>
          )}
        </div>
        <div
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 44,
            height: 44,
            backgroundColor: `${accentColor}1a`,
            border: `1px solid ${accentColor}40`,
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
