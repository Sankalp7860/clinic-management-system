
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Calendar, Clock, Search, X, CheckCircle } from "lucide-react";

interface Appointment {
  id: string;
  doctor: string;
  specialization: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  reason?: string;
}

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching appointments from backend
    const fetchAppointments = async () => {
      try {
        // This would connect to your backend API
        // const response = await fetch('http://localhost:8000/api/appointments');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            doctor: "Dr. Jane Smith",
            specialization: "Cardiologist",
            date: "2025-04-20",
            time: "10:00 AM",
            status: "upcoming",
            reason: "Annual heart checkup"
          },
          {
            id: "2",
            doctor: "Dr. Robert Johnson",
            specialization: "Dermatologist",
            date: "2025-04-18",
            time: "02:30 PM",
            status: "upcoming",
            reason: "Skin rash and allergies"
          },
          {
            id: "3",
            doctor: "Dr. Emily Wilson",
            specialization: "Neurologist",
            date: "2025-04-10",
            time: "09:15 AM",
            status: "completed",
            reason: "Follow-up on migraine treatment"
          },
          {
            id: "4",
            doctor: "Dr. Michael Brown",
            specialization: "Orthopedic",
            date: "2025-03-28",
            time: "11:30 AM",
            status: "completed",
            reason: "Knee pain assessment"
          },
          {
            id: "5",
            doctor: "Dr. Sarah Lee",
            specialization: "Ophthalmologist",
            date: "2025-03-15",
            time: "04:00 PM",
            status: "cancelled",
            reason: "Annual eye checkup"
          }
        ];
        
        setAppointments(mockAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  // Handle cancelling an appointment
  const handleCancelAppointment = (id: string) => {
    // This would connect to your backend API
    // In a real app, you would make an API call to cancel the appointment
    
    // For now, update locally
    setAppointments(appointments.map(appointment => 
      appointment.id === id 
        ? { ...appointment, status: "cancelled" } 
        : appointment
    ));
    
    toast.success("Appointment cancelled successfully");
  };

  // Filter appointments based on search query and tab
  const filterAppointments = (status: "upcoming" | "completed" | "cancelled") => {
    return appointments
      .filter(appointment => appointment.status === status)
      .filter(appointment => 
        appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appointment.reason && appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  };

  const upcomingAppointments = filterAppointments("upcoming");
  const completedAppointments = filterAppointments("completed");
  const cancelledAppointments = filterAppointments("cancelled");

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">
            View and manage all your appointments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>
              {appointments.length > 0 
                ? `You have ${upcomingAppointments.length} upcoming appointments`
                : "No appointments found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : (
              <Tabs defaultValue="upcoming">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Cancelled ({cancelledAppointments.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4 mt-4">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No upcoming appointments found
                    </div>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-blue-100">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.doctor}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                            {appointment.reason && (
                              <p className="text-sm mt-2">
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Reschedule
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4 mt-4">
                  {completedAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No completed appointments found
                    </div>
                  ) : (
                    completedAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.doctor}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                            {appointment.reason && (
                              <p className="text-sm mt-2">
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Book Again
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-4 mt-4">
                  {cancelledAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No cancelled appointments found
                    </div>
                  ) : (
                    cancelledAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-red-100">
                            <X className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.doctor}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                            {appointment.reason && (
                              <p className="text-sm mt-2">
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Book Again
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsList;
