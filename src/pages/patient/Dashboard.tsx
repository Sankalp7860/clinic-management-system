
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppointmentService from "@/services/appointment.service";
import AuthService from "@/services/auth.service";

interface Appointment {
  _id: string;
  doctor: {
    _id: string;
    name: string;
    specialization: string;
  };
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }

        // Check if user is a patient
        if (currentUser.role !== "patient") {
          navigate("/login");
          return;
        }

        setUser(currentUser);

        // Fetch patient appointments
        const appointmentResponse = await AppointmentService.getAppointments();
        setAppointments(appointmentResponse.data);
        
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter(
    appointment => appointment.status === "upcoming"
  );

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your health information and upcoming appointments.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingAppointments.length === 0 
                  ? "No upcoming appointments" 
                  : `Next appointment on ${new Date(upcomingAppointments[0].date).toLocaleDateString()}`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Visit
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.some(a => a.status === "completed") 
                  ? "Recently" 
                  : "No visits yet"}
              </div>
              <p className="text-xs text-muted-foreground">
                {appointments.some(a => a.status === "completed")
                  ? `Dr. ${appointments.find(a => a.status === "completed")?.doctor.name}`
                  : "Schedule your first appointment"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Medical Records
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Records available in your profile
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>
                Your most recent and upcoming appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No appointments found</p>
                ) : (
                  appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment._id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className={`p-2 rounded-full ${appointment.status === 'upcoming' ? 'bg-blue-100' : appointment.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Calendar className={`h-5 w-5 ${appointment.status === 'upcoming' ? 'text-blue-600' : appointment.status === 'completed' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{appointment.doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.doctor.specialization}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span>
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full ${appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/patient/appointments")}
                >
                  View All Appointments <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you might want to do
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  onClick={() => navigate("/patient/book-appointment")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/patient/medical-records")}
                >
                  <User className="mr-2 h-4 w-4" />
                  View Medical Records
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/patient/prescriptions")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  View Prescription History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
