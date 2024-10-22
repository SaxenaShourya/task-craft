'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, PieChart as PieChartIcon } from "lucide-react";

interface BoardDistributionChartProps {
  distributionData: Array<{ id: string; _count: number }>;
}

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const BoardDistributionChart: React.FC<BoardDistributionChartProps> = ({ distributionData }) => {
  const formattedData = distributionData.map((item, index) => ({
    name: `Board ${index + 1}`,
    value: item._count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChartIcon className="w-5 h-5 mr-2" />
          Board Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Board Distribution Data</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              There are no boards created yet. Start creating boards to see the distribution here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BoardDistributionChart;