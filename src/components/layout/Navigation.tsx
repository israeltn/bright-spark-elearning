import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Book,
  GraduationCap,
  Home,
  School,
  Settings,
  Users,
  X,
  BookOpen,
  Award,
  User,
  BarChart,
  Calendar
} from "lucide-react";

interface NavigationProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ mobile, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
    ];

    const roleBasedItems = {
      super_admin: [
        {
          name: "Schools",
          path: "/schools",
          icon: <School className="h-5 w-5" />,
        },
        {
          name: "Users",
          path: "/users",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Content",
          path: "/content",
          icon: <Book className="h-5 w-5" />,
        },
        {
          name: "Analytics",
          path: "/analytics",
          icon: <BarChart className="h-5 w-5" />,
        },
        {
          name: "Settings",
          path: "/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
      school_admin: [
        {
          name: "Teachers",
          path: "/teachers",
          icon: <User className="h-5 w-5" />,
        },
        {
          name: "Students",
          path: "/students",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Content",
          path: "/content",
          icon: <Book className="h-5 w-5" />,
        },
        {
          name: "Analytics",
          path: "/analytics",
          icon: <BarChart className="h-5 w-5" />,
        },
        {
          name: "Settings",
          path: "/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
      teacher: [
        {
          name: "Students",
          path: "/students",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Content",
          path: "/content",
          icon: <Book className="h-5 w-5" />,
        },
        {
          name: "Assignments",
          path: "/assignments",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          name: "Calendar",
          path: "/calendar",
          icon: <Calendar className="h-5 w-5" />,
        },
      ],
      student: [
        {
          name: "Subjects",
          path: "/subjects",
          icon: <Book className="h-5 w-5" />,
        },
        {
          name: "Assignments",
          path: "/assignments",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          name: "Progress",
          path: "/progress",
          icon: <BarChart className="h-5 w-5" />,
        },
        {
          name: "Badges",
          path: "/badges",
          icon: <Award className="h-5 w-5" />,
        },
      ],
      parent: [
        {
          name: "My Child",
          path: "/child",
          icon: <User className="h-5 w-5" />,
        },
        {
          name: "Assignments",
          path: "/assignments",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          name: "Progress",
          path: "/progress",
          icon: <BarChart className="h-5 w-5" />,
        },
      ],
    };

    return user?.role ? [...baseItems, ...roleBasedItems[user.role as keyof typeof roleBasedItems]] : baseItems;
  };

  return (
    <div className="flex h-full w-full flex-col border-r bg-white">
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="text-lg font-bold">Bright Spark</span>
        </div>
        {mobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {getNavItems().map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "nav-item",
              isActive(item.path) && "nav-item-active"
            )}
            onClick={mobile && onClose ? onClose : undefined}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-brand-purple p-2 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Logged in as:</p>
              <p className="text-xs text-gray-500">
                {user?.name} ({user?.role?.replace("_", " ")})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
