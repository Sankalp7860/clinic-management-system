
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Activity, ArrowRight } from "lucide-react";

interface Appointment {
  id: string;
  patient: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  reason?: string;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    // Check if user is logged in and is a doctor
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "doctor") {
      navigate("/login");
      return;
    }

    setUser(parsedUser);
    setLoading(false);

    // Mock data for today's appointments
    setTodayAppointments([
      {
        id: "1",
        patient: "John Smith",
        date: new Date().toISOString().split('T')[0],
        time: "10:00 AM",
        status: "upcoming",
        reason: "Annual checkup"
      },
      {
        id: "2",
        patient: "Alice Johnson",
        date: new Date().toISOString().split('T')[0],
        time: "11:30 AM",
        status: "upcoming",
        reason: "Follow-up consultation"
      },
      {
        id: "3",
        patient: "Bob Williams",
        date: new Date().toISOString().split('T')[0],
        time: "02:00 PM",
        status: "upcoming",
        reason: "New consultation"
      }
    ]);

    // Mock data for upcoming appointments (excluding today)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    setUpcomingAppointments([
      {
        id: "4",
        patient: "Emma Davis",
        date: tomorrow.toISOString().split('T')[0],
        time: "09:30 AM",
        status: "upcoming",
        reason: "Routine checkup"
      },
      {
        id: "5",
        patient: "Michael Brown",
        date: tomorrow.toISOString().split('T')[0],
        time: "01:00 PM",
        status: "upcoming",
        reason: "Discuss test results"
      },
      {
        id: "6",
        patient: "Sarah Miller",
        date: dayAfterTomorrow.toISOString().split('T')[0],
        time: "10:15 AM",
        status: "upcoming",
        reason: "Initial consultation"
      }
    ]);
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout userRole="doctor">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your appointments and patients.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayAppointments.length === 0 
                  ? "No appointments today" 
                  : `Next at ${todayAppointments[0].time}`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">138</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24m</div>
              <p className="text-xs text-muted-foreground">
                Per appointment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patient Satisfaction
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No appointments scheduled for today</p>
                ) : (
                  todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span>{appointment.time}</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        {appointment.reason && (
                          <p className="text-sm text-muted-foreground mt-1">{appointment.reason}</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your schedule for the next few days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                ) : (
                  upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="p-2 rounded-full bg-purple-100">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span>
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </span>
                        </div>
                        {appointment.reason && (
                          <p className="text-sm text-muted-foreground mt-1">{appointment.reason}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/doctor/appointments")}
                >
                  View All Appointments <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
