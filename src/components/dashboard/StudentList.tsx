
import React from "react";
import { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StudentListProps {
  students: User[];
  className?: string;
}

const StudentList: React.FC<StudentListProps> = ({ students, className }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Mock progress data - in a real app, this would come from API
  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className={cn("dashboard-section", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Students</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {students.length === 0 ? (
          <p className="text-center text-gray-500">No students found</p>
        ) : (
          students.map((student) => {
            const progress = getRandomProgress();
            return (
              <div
                key={student.id}
                className="flex items-center rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${student.id}`}
                    alt={student.name}
                  />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <p className="font-medium">{student.name}</p>
                  <div className="mt-1">
                    <Progress value={progress} className="h-1.5 w-full" />
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2",
                    progress >= 75
                      ? "border-green-500 text-green-700"
                      : progress >= 50
                      ? "border-yellow-500 text-yellow-700"
                      : "border-red-500 text-red-700"
                  )}
                >
                  {progress}% Progress
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentList;
