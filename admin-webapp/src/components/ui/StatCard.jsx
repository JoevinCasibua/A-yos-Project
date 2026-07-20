import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from './Card';
import Skeleton from './Skeleton';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, isLoading, color = 'primary' }) => {
  const bgMap = {
    primary: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    danger: 'bg-danger/10',
    info: 'bg-info/10',
    gray: 'bg-gray-100',
  };

  const iconColorMap = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info',
    gray: 'text-gray-500',
  };

  return (
    <Card className="animate-fade-in-up">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-gray-500">{title}</h3>
          <div className={`p-2 ${bgMap[color] || bgMap.primary} rounded-lg`}>
            <Icon className={`h-4 w-4 ${iconColorMap[color] || iconColorMap.primary}`} />
          </div>
        </div>
        <div className="flex flex-col mt-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="text-3xl font-display font-bold text-navy">{value}</div>
              {(trend || subtitle) && (
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  {trend && (
                    <span className={`flex items-center font-medium mr-2 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                      {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {trendValue}
                    </span>
                  )}
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
