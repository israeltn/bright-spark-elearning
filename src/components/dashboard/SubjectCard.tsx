
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Subject } from "@/types/data";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  const getIconComponent = () => {
    return <BookOpen className="h-6 w-6" />;
  };

  const getSubjectColor = () => {
    return subject.color || "#9b87f5";
  };

  return (
    <Card
      className="card-hover overflow-hidden"
      style={{ borderTopColor: getSubjectColor(), borderTopWidth: "4px" }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "rounded-full p-3",
              "bg-opacity-10"
            )}
            style={{ backgroundColor: `${getSubjectColor()}20` }}
          >
            <div style={{ color: getSubjectColor() }}>
              {getIconComponent()}
            </div>
          </div>
          <div className="space-x-1">
            {subject.keyStages.map((stage) => (
              <span
                key={stage}
                className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs"
              >
                {stage}
              </span>
            ))}
          </div>
        </div>

        <h3 className="mt-4 text-lg font-medium">{subject.name}</h3>
        
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            className="w-full"
            style={{ 
              borderColor: getSubjectColor(),
              color: getSubjectColor()
            }}
            onClick={onClick}
          >
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
