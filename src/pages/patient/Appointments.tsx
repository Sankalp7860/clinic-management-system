import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppointmentService from "@/services/appointment.service";

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
  reason: string;
  notes?: string;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AppointmentService.getAppointments();
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [toast]);

  const handleCancel = async (id: string) => {
    try {
      await AppointmentService.cancelAppointment(id);
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, status: "cancelled" } : app
      ));
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const upcomingAppointments = appointments.filter(a => a.status === "upcoming");
  const pastAppointments = appointments.filter(a => a.status !== "upcoming");

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <Button onClick={() => navigate("/patient/book-appointment")}>
            Book New Appointment
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Dr. {appointment.doctor.name}</h3>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancel(appointment._id)}
                        >
                          Cancel
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.doctor.specialization}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{appointment.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
            <CardDescription>
              Your previous appointments and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No past appointments</p>
              ) : (
                pastAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className={`p-3 rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Calendar className={`h-6 w-6 ${
                        appointment.status === 'completed' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Dr. {appointment.doctor.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.doctor.specialization}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{appointment.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;