
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, ClipboardCheck, ShieldAlert, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth.service";
import UserService from "@/services/user.service";
import AppointmentService from "@/services/appointment.service";

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  pendingDoctors: number;
  totalAppointments: number;
  upcomingAppointments: number;
}

interface DoctorVerification {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  createdAt: string;
  isVerified: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingDoctors, setPendingDoctors] = useState<DoctorVerification[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
    upcomingAppointments: 0
  });

  useEffect(() => {
    fetchData();
  }, [navigate, toast]);

  const fetchData = async () => {
    try {
      // Check if user is logged in
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }

      // Check if user is an admin
      if (currentUser.role !== "admin") {
        navigate("/login");
        return;
      }

      // Fetch all users
      const usersResponse = await UserService.getAllUsers();
      const users = usersResponse.data;
      
      // Count patients and doctors
      const patients = users.filter(user => user.role === 'patient');
      const doctors = users.filter(user => user.role === 'doctor');
      const pendingDoctorsCount = doctors.filter(doctor => !doctor.isVerified).length;
      
      // Fetch all appointments
      const appointmentsResponse = await AppointmentService.getAppointments();
      const appointments = appointmentsResponse.data;
      
      // Count upcoming appointments
      const upcomingAppointments = appointments.filter(
        appointment => appointment.status === "upcoming"
      );
      
      // Set stats
      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        pendingDoctors: pendingDoctorsCount,
        totalAppointments: appointments.length,
        upcomingAppointments: upcomingAppointments.length
      });

      // Fetch unverified doctors
      const unverifiedResponse = await UserService.getUnverifiedDoctors();
      setPendingDoctors(unverifiedResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId: string, approve: boolean) => {
    try {
      if (approve) {
        await UserService.verifyDoctor(doctorId);
        toast({
          title: "Success",
          description: "Doctor verified successfully",
        });
      } else {
        // Delete the doctor from the database instead of just updating
        await UserService.deleteUser(doctorId);
        toast({
          title: "Success",
          description: "Doctor application rejected and removed from the system",
        });
      }
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error updating doctor verification:", error);
      toast({
        title: "Error",
        description: "Failed to update doctor verification",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the hospital management system
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPatients}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered patients in the system
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Doctors
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                  <p className="text-xs text-muted-foreground">
                    Active doctors in the system
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Appointments
                  </CardTitle>
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.upcomingAppointments} upcoming appointments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Verifications
                  </CardTitle>
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingDoctors}</div>
                  <p className="text-xs text-muted-foreground">
                    Doctor accounts awaiting verification
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Doctor Verification Requests</CardTitle>
                <CardDescription>
                  Review and verify doctor registration requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingDoctors.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending verification requests
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDoctors.map((doctor) => (
                      <div 
                        key={doctor._id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialization} • {doctor.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Registered on {new Date(doctor.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/admin/doctors/${doctor._id}`)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleVerifyDoctor(doctor._id, true)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleVerifyDoctor(doctor._id, false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
