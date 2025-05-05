
import React from "react";
import { Assignment } from "@/types/data";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface UpcomingAssignmentsProps {
  assignments: Assignment[];
  className?: string;
}

const UpcomingAssignments: React.FC<UpcomingAssignmentsProps> = ({
  assignments,
  className,
}) => {
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  // Calculate days remaining
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Sort assignments by due date
  const sortedAssignments = [...assignments].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className={`dashboard-section ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Upcoming Assignments</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      {sortedAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Calendar className="mb-2 h-10 w-10 text-gray-400" />
          <p className="text-gray-500">No upcoming assignments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAssignments.map((assignment) => {
            const daysRemaining = getDaysRemaining(assignment.dueDate);
            return (
              <div
                key={assignment.id}
                className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <div
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      daysRemaining <= 1
                        ? "bg-red-100 text-red-800"
                        : daysRemaining <= 3
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {daysRemaining === 0
                      ? "Due today"
                      : daysRemaining < 0
                      ? `Overdue by ${Math.abs(daysRemaining)} days`
                      : `${daysRemaining} days left`}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {assignment.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    Due {formatDate(assignment.dueDate)}
                  </span>
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingAssignments;
