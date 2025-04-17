
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

interface Appointment {
  id: string;
  patient: string;
  patientAge?: string;
  patientGender?: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  reason?: string;
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Simulate fetching appointments from backend
    const fetchAppointments = async () => {
      try {
        // This would connect to your backend API
        // const response = await fetch('http://localhost:8000/api/doctor/appointments');
        // const data = await response.json();
        
        // Mock data for demonstration
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            patient: "John Smith",
            patientAge: "45",
            patientGender: "Male",
            date: today.toISOString().split('T')[0],
            time: "10:00 AM",
            status: "upcoming",
            reason: "Annual checkup"
          },
          {
            id: "2",
            patient: "Alice Johnson",
            patientAge: "32",
            patientGender: "Female",
            date: today.toISOString().split('T')[0],
            time: "11:30 AM",
            status: "upcoming",
            reason: "Follow-up consultation"
          },
          {
            id: "3",
            patient: "Bob Williams",
            patientAge: "28",
            patientGender: "Male",
            date: today.toISOString().split('T')[0],
            time: "02:00 PM",
            status: "upcoming",
            reason: "New consultation"
          },
          {
            id: "4",
            patient: "Emma Davis",
            patientAge: "52",
            patientGender: "Female",
            date: tomorrow.toISOString().split('T')[0],
            time: "09:30 AM",
            status: "upcoming",
            reason: "Routine checkup"
          },
          {
            id: "5",
            patient: "Michael Brown",
            patientAge: "60",
            patientGender: "Male",
            date: tomorrow.toISOString().split('T')[0],
            time: "01:00 PM",
            status: "upcoming",
            reason: "Discuss test results"
          },
          {
            id: "6",
            patient: "Sarah Miller",
            patientAge: "36",
            patientGender: "Female",
            date: yesterday.toISOString().split('T')[0],
            time: "10:15 AM",
            status: "completed",
            reason: "Initial consultation"
          },
          {
            id: "7",
            patient: "David Wilson",
            patientAge: "42",
            patientGender: "Male",
            date: yesterday.toISOString().split('T')[0],
            time: "03:45 PM",
            status: "completed",
            reason: "Follow-up after surgery"
          },
          {
            id: "8",
            patient: "Jennifer Lee",
            patientAge: "29",
            patientGender: "Female",
            date: yesterday.toISOString().split('T')[0],
            time: "09:00 AM",
            status: "cancelled",
            reason: "Consultation for headaches"
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

  // Handle updating appointment status
  const handleUpdateStatus = (id: string, newStatus: "completed" | "cancelled") => {
    // This would connect to your backend API
    // In a real app, you would make an API call to update the appointment status
    
    // For now, update locally
    setAppointments(appointments.map(appointment => 
      appointment.id === id 
        ? { ...appointment, status: newStatus } 
        : appointment
    ));
    
    toast.success(`Appointment marked as ${newStatus}`);
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
        appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  return (
    <DashboardLayout userRole="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage and view all your patient appointments
          </p>
        </div>
        
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
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {allAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No appointments found
                    </div>
                  ) : (
                    allAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
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
                            <h3 className="font-medium">{appointment.patient}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patientAge && <span>Age: {appointment.patientAge}</span>}
                              {appointment.patientGender && <span>• Gender: {appointment.patientGender}</span>}
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
                          >
                            View Patient
                          </Button>
                          {appointment.status === "upcoming" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleUpdateStatus(appointment.id, "completed")}
                              >
                                Mark Completed
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateStatus(appointment.id, "cancelled")}
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
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patient}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patientAge && <span>Age: {appointment.patientAge}</span>}
                              {appointment.patientGender && <span>• Gender: {appointment.patientGender}</span>}
                            </div>
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
                            View Patient
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleUpdateStatus(appointment.id, "completed")}
                          >
                            Mark Completed
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(appointment.id, "cancelled")}
                          >
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
                            <h3 className="font-medium">{appointment.patient}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patientAge && <span>Age: {appointment.patientAge}</span>}
                              {appointment.patientGender && <span>• Gender: {appointment.patientGender}</span>}
                            </div>
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
                            View Patient
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            Create New Appointment
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
                            <h3 className="font-medium">{appointment.patient}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {appointment.patientAge && <span>Age: {appointment.patientAge}</span>}
                              {appointment.patientGender && <span>• Gender: {appointment.patientGender}</span>}
                            </div>
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
                            View Patient
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            Create New Appointment
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
