
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
}

const specializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Ophthalmology",
  "Gynecology",
  "Oncology",
  "General Medicine"
];

// Time slots from 9 AM to 5 PM
const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM"
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  
  // Mock doctor data based on specialization
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Handle specialization change
  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
    
    // Simulate fetching doctors by specialization
    const mockDoctors: Doctor[] = [
      {
        id: "1",
        name: "Dr. Jane Smith",
        specialization: value,
        experience: "10 years"
      },
      {
        id: "2",
        name: "Dr. Robert Johnson",
        specialization: value,
        experience: "8 years"
      },
      {
        id: "3",
        name: "Dr. Emily Wilson",
        specialization: value,
        experience: "15 years"
      }
    ];
    
    setDoctors(mockDoctors);
  };

  // Check if a date is disabled (past dates and weekends)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) {
      return true;
    }
    
    // Disable weekends (Saturday is 6, Sunday is 0)
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Handle booking submission
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would connect to your backend API
      // const response = await fetch('http://localhost:8000/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     doctorId: selectedDoctor,
      //     date: selectedDate,
      //     time: selectedTime,
      //     reason: reason,
      //   }),
      // });
      
      // const data = await response.json();
      
      // For now, simulate successful booking
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Appointment booked successfully!");
        navigate("/patient/appointments");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Booking failed. Please try again.");
      console.error("Booking error:", error);
    }
  };

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Schedule an appointment with our specialist doctors
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>New Appointment</CardTitle>
            <CardDescription>
              Fill in the details to book your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    value={selectedSpecialization}
                    onValueChange={handleSpecializationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedSpecialization && (
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Select Doctor</Label>
                    <Select
                      value={selectedDoctor}
                      onValueChange={setSelectedDoctor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} ({doctor.experience})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  disabled={!selectedDoctor}
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Appointment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={isDateDisabled}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Appointment Time</Label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please describe your symptoms or reason for visit"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTime || isLoading}
                  >
                    {isLoading ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
