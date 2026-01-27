import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  accent?: boolean;
}

export function Card({ children, className = '', title, subtitle, accent = false }: CardProps) {
  return (
    <div className={`bg-csev-panel rounded-lg shadow-card border border-csev-border overflow-hidden ${accent ? 'card-accent' : ''} ${className}`}>
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-csev-border bg-csev-slate-800 ${accent ? 'pl-8' : ''}`}>
          {title && <h3 className="text-lg font-semibold text-csev-text-primary">{title}</h3>}
          {subtitle && <p className="text-sm text-csev-text-secondary mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={`p-6 ${accent ? 'pl-8' : ''}`}>{children}</div>
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-csev-border bg-csev-slate-800 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-csev-border bg-csev-slate-800 ${className}`}>
      {children}
    </div>
  );
}

// Stats Card for displaying key metrics
interface StatsCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  className?: string;
}

export function StatsCard({ label, value, prefix = '', className = '' }: StatsCardProps) {
  return (
    <div className={`bg-csev-panel rounded-lg p-4 border border-csev-border ${className}`}>
      <p className="section-header mb-2">{label}</p>
      <p className="stat-value">
        {prefix}{value}
      </p>
    </div>
  );
}
