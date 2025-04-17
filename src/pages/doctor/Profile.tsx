import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth.service";
import UserService from "@/services/user.service";

interface DoctorProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialization: string;
  experience: string;
  role: string;
}

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is logged in
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }

        // Check if user is a doctor
        if (currentUser.role !== "doctor") {
          navigate("/login");
          return;
        }

        // Fetch full profile data
        const response = await AuthService.getProfile();
        setProfile(response.data.data); // Note: API returns { data: { ... } }
        setLoading(false);
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      await UserService.updateUser(profile._id, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        specialization: profile.specialization,
        experience: profile.experience
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout userRole="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal information
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Doctor Profile</CardTitle>
              <CardDescription>
                Your personal and professional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profile?.name || ""}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={profile?.email || ""}
                        disabled={true} // Email cannot be changed
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile?.phone || ""}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profile?.address || ""}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        value={profile?.specialization || ""}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={profile?.experience || ""}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    {editing ? (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;