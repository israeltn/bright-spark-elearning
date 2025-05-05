
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
import { ArrowLeft, Save } from "lucide-react";
import { LearningContent } from "@/types/data";

const ContentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { subjects, learningContent, fetchSubjects } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    keyStage: "",
    contentType: "",
    contentUrl: "",
    thumbnailUrl: "",
  });

  useEffect(() => {
    fetchSubjects();

    // If editing, populate form data
    if (id) {
      const contentToEdit = learningContent.find((c) => c.id === id);
      if (contentToEdit) {
        setFormData({
          title: contentToEdit.title,
          description: contentToEdit.description,
          subjectId: contentToEdit.subjectId,
          keyStage: contentToEdit.keyStage,
          contentType: contentToEdit.contentType,
          contentUrl: contentToEdit.contentUrl || "",
          thumbnailUrl: contentToEdit.thumbnailUrl || "",
        });
      } else {
        toast.error("Content not found");
        navigate("/content");
      }
    }
  }, [id, learningContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subjectId || !formData.contentType || !formData.keyStage) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (id) {
        toast.success("Content updated successfully");
      } else {
        toast.success("New content created successfully");
      }
      navigate("/content");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is authorized to add/edit content
  if (user?.role !== "teacher" && user?.role !== "school_admin" && user?.role !== "super_admin") {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-red-600">You don't have permission to add or edit content.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/content")}
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
        <Button variant="ghost" onClick={() => navigate("/content")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Learning Content" : "Create New Learning Content"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter content title"
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
                placeholder="Enter content description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.contentType} 
                  onValueChange={(value) => handleSelectChange("contentType", value)}
                  required
                >
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keyStage">Key Stage <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.keyStage} 
                  onValueChange={(value) => handleSelectChange("keyStage", value)}
                  required
                >
                  <SelectTrigger id="keyStage">
                    <SelectValue placeholder="Select key stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KS1">KS1</SelectItem>
                    <SelectItem value="KS2">KS2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contentUrl">Content URL</Label>
                <Input
                  id="contentUrl"
                  name="contentUrl"
                  placeholder="Enter content URL (for videos, documents, etc.)"
                  value={formData.contentUrl}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  placeholder="Enter thumbnail image URL"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/content")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : id ? "Update Content" : "Create Content"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ContentForm;
