
import React, { createContext, useState, useContext, useEffect } from "react";
import { DataContextType, School, Subject, LearningContent, Assignment, Badge, UserBadge, StudentProgress } from "@/types/data";
import { User, UserRole } from "@/types/auth";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { toast } from "@/components/ui/sonner";

// Mock data service
const BASE_URL = "/api"; // This would be a real API endpoint in production

// Initialize with empty data
export const DataContext = createContext<DataContextType>({
  schools: [],
  subjects: [],
  learningContent: [],
  assignments: [],
  badges: [],
  userBadges: [],
  studentProgress: [],
  users: [],
  fetchSchools: async () => [],
  fetchUsers: async () => [],
  fetchSubjects: async () => [],
  fetchLearningContent: async () => [],
  fetchAssignments: async () => [],
  fetchBadges: async () => [],
  fetchUserBadges: async () => [],
  fetchStudentProgress: async () => []
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [learningContent, setLearningContent] = useState<LearningContent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Mock data
  const mockSchools: School[] = [
    {
      id: "1",
      name: "Oakridge Primary School",
      address: "123 School Lane, London",
      subscriptionPlan: {
        id: "basic",
        name: "Basic Plan",
        price: 99,
        maxStudents: 200,
        maxTeachers: 15,
        features: ["Core Subjects", "Basic Analytics", "Email Support"]
      },
      subscriptionStatus: "active",
      studentsCount: 150,
      teachersCount: 12
    },
    {
      id: "2",
      name: "Meadowbrook Academy",
      address: "456 Learning Drive, Manchester",
      subscriptionPlan: {
        id: "premium",
        name: "Premium Plan",
        price: 199,
        maxStudents: 500,
        maxTeachers: 30,
        features: ["All Subjects", "Advanced Analytics", "Priority Support", "Custom Content"]
      },
      subscriptionStatus: "trial",
      trialEndsAt: "2025-06-15",
      studentsCount: 320,
      teachersCount: 24
    }
  ];

  const mockSubjects: Subject[] = [
    { id: "1", name: "Mathematics", icon: "calculator", color: "#4CAF50", keyStages: ["KS1", "KS2"] },
    { id: "2", name: "English", icon: "book", color: "#2196F3", keyStages: ["KS1", "KS2"] },
    { id: "3", name: "Science", icon: "flask", color: "#9C27B0", keyStages: ["KS1", "KS2"] },
    { id: "4", name: "Geography", icon: "globe", color: "#FF9800", keyStages: ["KS1", "KS2"] },
    { id: "5", name: "History", icon: "clock", color: "#795548", keyStages: ["KS1", "KS2"] }
  ];
  
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Super Admin",
      email: "admin@brightspark.com",
      role: "super_admin",
      avatar: "/assets/avatars/super-admin.png"
    },
    {
      id: "2",
      name: "School Admin",
      email: "school@brightspark.com",
      role: "school_admin",
      schoolId: "1",
      avatar: "/assets/avatars/school-admin.png"
    },
    {
      id: "3",
      name: "Teacher Smith",
      email: "teacher@brightspark.com",
      role: "teacher",
      schoolId: "1",
      avatar: "/assets/avatars/teacher.png"
    },
    {
      id: "4",
      name: "Student Jones",
      email: "student@brightspark.com",
      role: "student",
      schoolId: "1",
      avatar: "/assets/avatars/student.png"
    },
    {
      id: "5",
      name: "Parent Brown",
      email: "parent@brightspark.com",
      role: "parent",
      schoolId: "1",
      avatar: "/assets/avatars/parent.png"
    },
    {
      id: "6",
      name: "Teacher Johnson",
      email: "johnson@brightspark.com",
      role: "teacher",
      schoolId: "1",
      avatar: "/assets/avatars/teacher-2.png"
    },
    {
      id: "7",
      name: "Student Williams",
      email: "williams@brightspark.com",
      role: "student",
      schoolId: "1",
      avatar: "/assets/avatars/student-2.png"
    }
  ];

  const mockLearningContent: LearningContent[] = [
    {
      id: "1",
      title: "Basic Addition for Year 1",
      description: "Learn to add numbers up to 20",
      subjectId: "1",
      keyStage: "KS1",
      contentType: "video",
      contentUrl: "/content/math/addition.mp4",
      thumbnailUrl: "/thumbnails/math/addition.jpg",
      createdBy: "3",
      createdAt: "2025-04-01",
      updatedAt: "2025-04-01"
    },
    {
      id: "2",
      title: "Phonics: Short Vowel Sounds",
      description: "Learn the short vowel sounds with fun exercises",
      subjectId: "2",
      keyStage: "KS1",
      contentType: "activity",
      thumbnailUrl: "/thumbnails/english/phonics.jpg",
      createdBy: "3",
      createdAt: "2025-04-02",
      updatedAt: "2025-04-03"
    },
    {
      id: "3",
      title: "Plants and Growth",
      description: "Explore how plants grow and what they need",
      subjectId: "3",
      keyStage: "KS1",
      contentType: "quiz",
      thumbnailUrl: "/thumbnails/science/plants.jpg",
      createdBy: "6",
      createdAt: "2025-04-05",
      updatedAt: "2025-04-05"
    },
    {
      id: "4",
      title: "Multiplication Tables: 2, 5 and 10",
      description: "Practice multiplication tables with interactive games",
      subjectId: "1",
      keyStage: "KS2",
      contentType: "activity",
      thumbnailUrl: "/thumbnails/math/multiplication.jpg",
      createdBy: "3",
      createdAt: "2025-04-10",
      updatedAt: "2025-04-10"
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: "1",
      title: "Weekly Math Quiz",
      description: "Complete the addition and subtraction practice",
      dueDate: "2025-05-15",
      subjectId: "1",
      teacherId: "3",
      studentIds: ["4", "7"],
      contentIds: ["1"],
      createdAt: "2025-05-01"
    },
    {
      id: "2",
      title: "Reading Comprehension",
      description: "Read the short story and answer the questions",
      dueDate: "2025-05-18",
      subjectId: "2",
      teacherId: "6",
      studentIds: ["4"],
      contentIds: ["2"],
      createdAt: "2025-05-03"
    }
  ];

  const mockBadges: Badge[] = [
    {
      id: "1",
      name: "Math Star",
      description: "Awarded for excellent performance in mathematics",
      imageUrl: "/badges/math-star.png",
      criteria: "Score 90% or higher on 3 math assessments"
    },
    {
      id: "2",
      name: "Reading Champion",
      description: "Awarded for consistent reading practice",
      imageUrl: "/badges/reading-champion.png",
      criteria: "Complete 10 reading assignments"
    },
    {
      id: "3",
      name: "Science Explorer",
      description: "Awarded for curiosity and excellence in science",
      imageUrl: "/badges/science-explorer.png",
      criteria: "Complete all science activities in a unit"
    }
  ];

  const mockUserBadges: UserBadge[] = [
    {
      id: "1",
      userId: "4",
      badgeId: "1",
      awardedAt: "2025-04-15"
    },
    {
      id: "2",
      userId: "4",
      badgeId: "2",
      awardedAt: "2025-04-20"
    }
  ];

  const mockStudentProgress: StudentProgress[] = [
    {
      id: "1",
      studentId: "4",
      contentId: "1",
      progress: 100,
      score: 85,
      completedAt: "2025-04-10",
      attempts: 1
    },
    {
      id: "2",
      studentId: "4",
      contentId: "2",
      progress: 100,
      score: 92,
      completedAt: "2025-04-12",
      attempts: 1
    },
    {
      id: "3",
      studentId: "4",
      contentId: "3",
      progress: 75,
      attempts: 1
    },
    {
      id: "4",
      studentId: "7",
      contentId: "1",
      progress: 100,
      score: 78,
      completedAt: "2025-04-11",
      attempts: 2
    }
  ];

  // API simulation methods
  const fetchSchools = async (): Promise<School[]> => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${BASE_URL}/schools`);
      // return response.data;
      
      // Simulated response
      await new Promise(resolve => setTimeout(resolve, 500));
      setSchools(mockSchools);
      return mockSchools;
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast.error("Failed to fetch schools");
      return [];
    }
  };

  const fetchUsers = async (role?: UserRole): Promise<User[]> => {
    try {
      // Simulated response
      await new Promise(resolve => setTimeout(resolve, 500));
      const filteredUsers = role ? mockUsers.filter(u => u.role === role) : mockUsers;
      setUsers(filteredUsers);
      return filteredUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const fetchSubjects = async (): Promise<Subject[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSubjects(mockSubjects);
      return mockSubjects;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
      return [];
    }
  };

  const fetchLearningContent = async (subjectId?: string): Promise<LearningContent[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const filteredContent = subjectId 
        ? mockLearningContent.filter(c => c.subjectId === subjectId)
        : mockLearningContent;
      setLearningContent(filteredContent);
      return filteredContent;
    } catch (error) {
      console.error("Error fetching learning content:", error);
      toast.error("Failed to fetch learning content");
      return [];
    }
  };

  const fetchAssignments = async (userId: string): Promise<Assignment[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const userRole = mockUsers.find(u => u.id === userId)?.role;
      
      let filteredAssignments: Assignment[] = [];
      if (userRole === "teacher") {
        filteredAssignments = mockAssignments.filter(a => a.teacherId === userId);
      } else if (userRole === "student") {
        filteredAssignments = mockAssignments.filter(a => a.studentIds.includes(userId));
      } else {
        filteredAssignments = mockAssignments;
      }
      
      setAssignments(filteredAssignments);
      return filteredAssignments;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to fetch assignments");
      return [];
    }
  };

  const fetchBadges = async (): Promise<Badge[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBadges(mockBadges);
      return mockBadges;
    } catch (error) {
      console.error("Error fetching badges:", error);
      toast.error("Failed to fetch badges");
      return [];
    }
  };

  const fetchUserBadges = async (userId: string): Promise<UserBadge[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const filteredBadges = mockUserBadges.filter(b => b.userId === userId);
      setUserBadges(filteredBadges);
      return filteredBadges;
    } catch (error) {
      console.error("Error fetching user badges:", error);
      toast.error("Failed to fetch user badges");
      return [];
    }
  };

  const fetchStudentProgress = async (studentId: string): Promise<StudentProgress[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const filteredProgress = mockStudentProgress.filter(p => p.studentId === studentId);
      setStudentProgress(filteredProgress);
      return filteredProgress;
    } catch (error) {
      console.error("Error fetching student progress:", error);
      toast.error("Failed to fetch student progress");
      return [];
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      // Load data based on user role
      fetchSchools();
      fetchSubjects();
      fetchBadges();
      
      if (user.role === "super_admin" || user.role === "school_admin") {
        fetchUsers();
      }
      
      if (user.role === "teacher" || user.role === "school_admin") {
        fetchLearningContent();
      }
      
      if (user.role === "teacher") {
        fetchAssignments(user.id);
      }
      
      if (user.role === "student") {
        fetchAssignments(user.id);
        fetchUserBadges(user.id);
        fetchStudentProgress(user.id);
      }
      
      if (user.role === "parent") {
        // In a real app, we would fetch the children of this parent
        // For demo, we'll just fetch student with ID 4
        fetchAssignments("4");
        fetchUserBadges("4");
        fetchStudentProgress("4");
      }
    }
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        schools,
        subjects,
        learningContent,
        assignments,
        badges,
        userBadges,
        studentProgress,
        users,
        fetchSchools,
        fetchUsers,
        fetchSubjects,
        fetchLearningContent,
        fetchAssignments,
        fetchBadges,
        fetchUserBadges,
        fetchStudentProgress
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
