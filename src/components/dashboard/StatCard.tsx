
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  className,
}) => {
  return (
    <div
      className={cn(
        "dashboard-section flex items-center p-6",
        className
      )}
    >
      {icon && (
        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && change !== undefined && (
          <div className="mt-1 flex items-center">
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
              )}
            >
              {trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : trend === "down" ? (
                <ArrowDown className="mr-1 h-3 w-3" />
              ) : null}
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="ml-1 text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
