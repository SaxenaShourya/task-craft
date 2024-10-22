import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, AlertCircle } from 'lucide-react';
import { Prisma } from '@prisma/client';

interface CardDistributionProps {
  cardDistribution: (Prisma.PickEnumerable<Prisma.CardGroupByOutputType, "listId"[]> & {
    _count: {
      listId: number;
    };
  })[];
  listTitleMap: { [key: string]: string };
  totalCards: number;
}

const CardDistribution: React.FC<CardDistributionProps> = ({ cardDistribution, listTitleMap, totalCards }) => {
  return (
    <Card className="w-full h-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center text-base sm:text-lg font-semibold">
          <BarChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Top 5 Lists by Card Count
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {cardDistribution.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {cardDistribution.map((item, index) => (
              <div key={item.listId} className="flex flex-col space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs sm:text-sm font-medium truncate">{listTitleMap[item.listId] || `List ${index + 1}`}</div>
                  <div className="text-xs sm:text-sm font-medium">{item._count.listId}</div>
                </div>
                <div className="w-full h-1.5 sm:h-3 bg-foreground/10 rounded-full">
                  <div
                    className="h-1.5 sm:h-3 bg-primary rounded-full"
                    style={{ width: `${(item._count.listId / totalCards) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Card Distribution Data</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              There are no cards in any lists yet. Start adding cards to your boards to see the distribution here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardDistribution;