
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save } from "lucide-react";

const SchoolForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { schools, fetchSchools } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    subscriptionPlanId: "",
    subscriptionStatus: "trial",
    trialEndsAt: "",
    studentsCount: 0,
    teachersCount: 0
  });

  // Sample subscription plans
  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 99,
      maxStudents: 200,
      maxTeachers: 15,
      features: ["Core Subjects", "Basic Analytics", "Email Support"]
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: 199,
      maxStudents: 500,
      maxTeachers: 30,
      features: ["All Subjects", "Advanced Analytics", "Priority Support", "Custom Content"]
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 399,
      maxStudents: 1000,
      maxTeachers: 60,
      features: ["All Premium Features", "API Access", "White Labeling", "Dedicated Support"]
    }
  ];

  useEffect(() => {
    fetchSchools();

    // If editing, populate form data
    if (id) {
      const schoolToEdit = schools.find((s) => s.id === id);
      if (schoolToEdit) {
        setFormData({
          name: schoolToEdit.name,
          address: schoolToEdit.address,
          subscriptionPlanId: schoolToEdit.subscriptionPlan.id,
          subscriptionStatus: schoolToEdit.subscriptionStatus,
          trialEndsAt: schoolToEdit.trialEndsAt || "",
          studentsCount: schoolToEdit.studentsCount,
          teachersCount: schoolToEdit.teachersCount
        });
      } else {
        toast.error("School not found");
        navigate("/schools");
      }
    } else {
      // Set default trial end date to 30 days from now
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        trialEndsAt: trialEndDate.toISOString().split('T')[0]
      }));
    }
  }, [id, schools]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.subscriptionPlanId || !formData.subscriptionStatus) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.subscriptionStatus === "trial" && !formData.trialEndsAt) {
      toast.error("Please specify a trial end date");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (id) {
        toast.success("School updated successfully");
      } else {
        toast.success("School added successfully");
      }
      navigate("/schools");
    } catch (error) {
      console.error("Error saving school:", error);
      toast.error("Failed to save school");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is authorized to manage schools
  if (user?.role !== "super_admin") {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
          <p className="mt-2 text-red-600">Only Super Admins can manage schools.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/schools")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schools
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit School" : "Add New School"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">School Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter school name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter school address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Subscription Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="subscriptionPlanId">Subscription Plan <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.subscriptionPlanId} 
                  onValueChange={(value) => handleSelectChange("subscriptionPlanId", value)}
                  required
                >
                  <SelectTrigger id="subscriptionPlanId">
                    <SelectValue placeholder="Select subscription plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - £{plan.price}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Subscription Status <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formData.subscriptionStatus}
                  onValueChange={(value) => handleSelectChange("subscriptionStatus", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trial" id="trial" />
                    <Label htmlFor="trial" className="cursor-pointer">Trial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="cursor-pointer">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expired" id="expired" />
                    <Label htmlFor="expired" className="cursor-pointer">Expired</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formData.subscriptionStatus === "trial" && (
                <div className="space-y-2">
                  <Label htmlFor="trialEndsAt">Trial End Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="trialEndsAt"
                    name="trialEndsAt"
                    type="date"
                    value={formData.trialEndsAt}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              )}
            </div>

            {id && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Usage</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="studentsCount">Number of Students</Label>
                    <Input
                      id="studentsCount"
                      name="studentsCount"
                      type="number"
                      min="0"
                      value={formData.studentsCount}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teachersCount">Number of Teachers</Label>
                    <Input
                      id="teachersCount"
                      name="teachersCount"
                      type="number"
                      min="0"
                      value={formData.teachersCount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.subscriptionPlanId && (
              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="text-sm font-medium">Plan Features</h3>
                <ul className="mt-2 space-y-1">
                  {subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="mr-2 text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/schools")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : id ? "Update School" : "Add School"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SchoolForm;
