
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, ClipboardCheck, ShieldAlert, ArrowRight } from "lucide-react";

interface DoctorVerification {
  id: string;
  name: string;
  specialization: string;
  email: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerifications, setPendingVerifications] = useState<DoctorVerification[]>([]);
  
  useEffect(() => {
    // Check if user is logged in and is an admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      navigate("/login");
      return;
    }

    setUser(parsedUser);
    setLoading(false);

    // Mock data for pending doctor verifications
    setPendingVerifications([
      {
        id: "1",
        name: "Dr. Mark Johnson",
        specialization: "Cardiologist",
        email: "mark.johnson@example.com",
        date: "2025-04-16",
        status: "pending"
      },
      {
        id: "2",
        name: "Dr. Lisa Wong",
        specialization: "Neurologist",
        email: "lisa.wong@example.com",
        date: "2025-04-15",
        status: "pending"
      },
      {
        id: "3",
        name: "Dr. James Thompson",
        specialization: "Orthopedic",
        email: "james.thompson@example.com",
        date: "2025-04-14",
        status: "pending"
      }
    ]);
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your hospital management system.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,543</div>
              <p className="text-xs text-muted-foreground">
                +180 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Registered Doctors
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                +4 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Appointments Today
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">
                +5 more than yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Doctor Verification Requests
              </CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingVerifications.length}</div>
              <p className="text-xs text-muted-foreground">
                Pending approval
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Pending Doctor Verifications</CardTitle>
              <CardDescription>
                New doctor registrations awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVerifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending verification requests</p>
                ) : (
                  pendingVerifications.slice(0, 3).map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-sm text-muted-foreground">{doctor.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Registered on {new Date(doctor.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/admin/verify-doctors")}
                >
                  View All Requests <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>
                Key statistics from your hospital management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">Total Appointments This Month</span>
                  </div>
                  <span className="font-bold">876</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">New Patients This Month</span>
                  </div>
                  <span className="font-bold">180</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium">Average Appointments Per Day</span>
                  </div>
                  <span className="font-bold">29</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium">Total Specialties Available</span>
                  </div>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Cancelled Appointments This Month</span>
                  </div>
                  <span className="font-bold">32</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Button 
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => navigate("/admin/verify-doctors")}
                >
                  <ShieldAlert className="h-6 w-6" />
                  <span>Verify Doctors</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-24 gap-2"
                >
                  <Users className="h-6 w-6" />
                  <span>Manage Patients</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-24 gap-2"
                >
                  <UserCheck className="h-6 w-6" />
                  <span>View Doctors</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-24 gap-2"
                >
                  <ClipboardCheck className="h-6 w-6" />
                  <span>View Appointments</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
