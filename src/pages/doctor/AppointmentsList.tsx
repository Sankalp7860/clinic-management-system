
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Calendar, Clock, Search, CheckCircle, X, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import AppointmentService from "@/services/appointment.service";
import AuthService from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    age?: string;
    gender?: string;
  };
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  reason?: string;
}

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchAppointments = async () => {
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

        // Fetch appointments from backend for the logged-in doctor
        const response = await AppointmentService.getAppointments();
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [navigate]);

  // Handle updating appointment status
  const handleUpdateStatus = async (id: string, newStatus: "completed" | "cancelled") => {
    try {
      // Make API call to update the appointment status
      await AppointmentService.updateAppointment(id, { status: newStatus });
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment._id === id 
          ? { ...appointment, status: newStatus } 
          : appointment
      ));
      
      toast.success(`Appointment marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  // Filter appointments based on search query, date, status, and tab
  const filterAppointments = (status: "upcoming" | "completed" | "cancelled" | "all") => {
    return appointments
      .filter(appointment => 
        status === "all" ? true : appointment.status === status
      )
      .filter(appointment => 
        selectedDate 
          ? appointment.date === selectedDate.toISOString().split('T')[0] 
          : true
      )
      .filter(appointment => 
        statusFilter === "all" 
          ? true 
          : appointment.status === statusFilter
      )
      .filter(appointment => 
        appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appointment.reason && appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  };

  const allAppointments = filterAppointments("all");
  const upcomingAppointments = filterAppointments("upcoming");
  const completedAppointments = filterAppointments("completed");
  const cancelledAppointments = filterAppointments("cancelled");

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    appointment => appointment.date === today && appointment.status === "upcoming"
  );

  // Rest of your component remains the same, but update references to appointment.patient to appointment.patient.name
  // and appointment.id to appointment._id

  return (
    <DashboardLayout userRole="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage and view all your patient appointments
          </p>
        </div>
        
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patient name or reason..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Date and status filters */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[180px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            {(selectedDate || statusFilter !== "all") && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSelectedDate(undefined);
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Appointments card */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>
              {todayAppointments.length > 0 
                ? `You have ${todayAppointments.length} appointments today`
                : "No appointments scheduled for today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">
                    All ({allAppointments.length})
                  </TabsTrigger>
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
                
                {/* All appointments tab */}
                <TabsContent value="all" className="space-y-4 mt-4">
                  {allAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No appointments found
                    </div>
                  ) : (
                    allAppointments.map((appointment) => (
                      <div 
                        key={appointment._id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className={`p-2 rounded-full ${
                            appointment.status === 'upcoming' 
                              ? 'bg-blue-100' 
                              : appointment.status === 'completed' 
                                ? 'bg-green-100' 
                                : 'bg-red-100'
                          }`}>
                            {appointment.status === 'upcoming' 
                              ? <Clock className="h-5 w-5 text-blue-600" />
                              : appointment.status === 'completed' 
                                ? <CheckCircle className="h-5 w-5 text-green-600" /> 
                                : <X className="h-5 w-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patient.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patient.age && <span>Age: {appointment.patient.age}</span>}
                              {appointment.patient.gender && <span>• Gender: {appointment.patient.gender}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                              <span className="text-sm">{appointment.time}</span>
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                appointment.status === 'upcoming' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : appointment.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
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
                            onClick={() => navigate(`/doctor/patients/${appointment.patient._id}`)}
                          >
                            View Patient
                          </Button>
                          {appointment.status === "upcoming" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleUpdateStatus(appointment._id, "completed")}
                              >
                                Mark Completed
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateStatus(appointment._id, "cancelled")}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                {/* Upcoming appointments tab */}
                <TabsContent value="upcoming" className="space-y-4 mt-4">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No upcoming appointments found
                    </div>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <div 
                        key={appointment._id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-blue-100">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patient.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patient.age && <span>Age: {appointment.patient.age}</span>}
                              {appointment.patient.gender && <span>• Gender: {appointment.patient.gender}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                              <span className="text-sm">{appointment.time}</span>
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                Upcoming
                              </span>
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
                            onClick={() => navigate(`/doctor/patients/${appointment.patient._id}`)}
                          >
                            View Patient
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleUpdateStatus(appointment._id, "completed")}
                          >
                            Mark Completed
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(appointment._id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                {/* Completed appointments tab */}
                <TabsContent value="completed" className="space-y-4 mt-4">
                  {completedAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No completed appointments found
                    </div>
                  ) : (
                    completedAppointments.map((appointment) => (
                      <div 
                        key={appointment._id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patient.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patient.age && <span>Age: {appointment.patient.age}</span>}
                              {appointment.patient.gender && <span>• Gender: {appointment.patient.gender}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                              <span className="text-sm">{appointment.time}</span>
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                                Completed
                              </span>
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
                            onClick={() => navigate(`/doctor/patients/${appointment.patient._id}`)}
                          >
                            View Patient
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                {/* Cancelled appointments tab */}
                <TabsContent value="cancelled" className="space-y-4 mt-4">
                  {cancelledAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No cancelled appointments found
                    </div>
                  ) : (
                    cancelledAppointments.map((appointment) => (
                      <div 
                        key={appointment._id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-2 rounded-full bg-red-100">
                            <X className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patient.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patient.age && <span>Age: {appointment.patient.age}</span>}
                              {appointment.patient.gender && <span>• Gender: {appointment.patient.gender}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                              <span className="text-sm">{appointment.time}</span>
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                                Cancelled
                              </span>
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
                            onClick={() => navigate(`/doctor/patients/${appointment.patient._id}`)}
                          >
                            View Patient
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

export default DoctorAppointments;
