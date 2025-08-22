import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  changeType = 'neutral' 
}: StatsCardProps) {
  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600';
    if (changeType === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className={`${color} p-6 text-white`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Icon className="text-xl" />
          </div>
          {change && (
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold" data-testid={`stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </p>
        <p className="text-opacity-80" data-testid={`stat-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </p>
      </CardContent>
    </Card>
  );
}
