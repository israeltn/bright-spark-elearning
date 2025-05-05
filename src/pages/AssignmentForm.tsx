
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";

const AssignmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { subjects, learningContent, assignments, users, fetchSubjects, fetchUsers, fetchLearningContent } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [availableContent, setAvailableContent] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    studentIds: [] as string[],
    contentIds: [] as string[],
  });

  useEffect(() => {
    fetchSubjects();
    fetchUsers("student");
    
    // If editing, populate form data
    if (id) {
      const assignmentToEdit = assignments.find((a) => a.id === id);
      if (assignmentToEdit) {
        setFormData({
          title: assignmentToEdit.title,
          description: assignmentToEdit.description,
          subjectId: assignmentToEdit.subjectId,
          dueDate: format(new Date(assignmentToEdit.dueDate), "yyyy-MM-dd"),
          studentIds: assignmentToEdit.studentIds,
          contentIds: assignmentToEdit.contentIds,
        });
        
        // Load content for the selected subject
        fetchLearningContent(assignmentToEdit.subjectId);
      } else {
        toast.error("Assignment not found");
        navigate("/assignments");
      }
    }
  }, [id, assignments]);

  useEffect(() => {
    // Filter students based on teacher's school
    if (user?.role === "teacher" && user?.schoolId) {
      const schoolStudents = users.filter(u => u.role === "student" && u.schoolId === user.schoolId);
      setStudents(schoolStudents);
    }
  }, [users, user]);

  useEffect(() => {
    // Update available content when subject changes
    if (formData.subjectId) {
      const subjectContent = learningContent.filter(content => content.subjectId === formData.subjectId);
      setAvailableContent(subjectContent);
    } else {
      setAvailableContent([]);
    }
  }, [formData.subjectId, learningContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If subject changes, reset content selection
    if (name === "subjectId") {
      setFormData(prev => ({ ...prev, contentIds: [] }));
      fetchLearningContent(value);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setFormData((prev) => {
      const studentIds = [...prev.studentIds];
      
      if (studentIds.includes(studentId)) {
        return { ...prev, studentIds: studentIds.filter(id => id !== studentId) };
      } else {
        return { ...prev, studentIds: [...studentIds, studentId] };
      }
    });
  };

  const handleContentToggle = (contentId: string) => {
    setFormData((prev) => {
      const contentIds = [...prev.contentIds];
      
      if (contentIds.includes(contentId)) {
        return { ...prev, contentIds: contentIds.filter(id => id !== contentId) };
      } else {
        return { ...prev, contentIds: [...contentIds, contentId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subjectId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.studentIds.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    if (formData.contentIds.length === 0) {
      toast.error("Please select at least one learning content");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (id) {
        toast.success("Assignment updated successfully");
      } else {
        toast.success("New assignment created successfully");
      }
      navigate("/assignments");
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Failed to save assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is authorized to add/edit assignments
  if (user?.role !== "teacher") {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-red-600">Only teachers can create or edit assignments.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/assignments")}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/assignments")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assignments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Assignment" : "Create New Assignment"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subjectId">Subject <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.subjectId} 
                  onValueChange={(value) => handleSelectChange("subjectId", value)}
                  required
                >
                  <SelectTrigger id="subjectId">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter assignment description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={format(new Date(), "yyyy-MM-dd")}
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="mb-2 block">
                  Assign to Students <span className="text-red-500">*</span>
                </Label>
                
                {students.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-center text-gray-500">
                    No students available to assign
                  </div>
                ) : (
                  <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-3">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`student-${student.id}`} 
                          checked={formData.studentIds.includes(student.id)}
                          onCheckedChange={() => handleStudentToggle(student.id)}
                        />
                        <label 
                          htmlFor={`student-${student.id}`}
                          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {student.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="mb-2 block">
                  Attach Content <span className="text-red-500">*</span>
                </Label>
                
                {!formData.subjectId ? (
                  <div className="rounded-md border border-dashed p-4 text-center text-gray-500">
                    Please select a subject first
                  </div>
                ) : availableContent.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-center text-gray-500">
                    No content available for this subject
                  </div>
                ) : (
                  <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-3">
                    {availableContent.map((content) => (
                      <div key={content.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`content-${content.id}`} 
                          checked={formData.contentIds.includes(content.id)}
                          onCheckedChange={() => handleContentToggle(content.id)}
                        />
                        <label 
                          htmlFor={`content-${content.id}`}
                          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {content.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/assignments")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : id ? "Update Assignment" : "Create Assignment"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AssignmentForm;
