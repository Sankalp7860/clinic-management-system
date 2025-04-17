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

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is logged in
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
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
        address: profile.address
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

  if (loading) {
    return <DashboardLayout userRole="patient">
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading profile...</div>
      </div>
    </DashboardLayout>;
  }

  if (!profile) {
    return <DashboardLayout userRole="patient">
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-600">Failed to load profile</div>
      </div>
    </DashboardLayout>;
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <Button variant="outline" onClick={() => navigate("/patient/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Manage your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                {editing ? (
                  <>
                    <Button type="submit">Save Changes</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
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
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;