
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserService from "@/services/user.service";
import AppointmentService from "@/services/appointment.service";
import AuthService from "@/services/auth.service";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
    notes: ""
  });

  useEffect(() => {
    const fetchDoctors = async () => {
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

        // Fetch verified doctors only
        const response = await UserService.getVerifiedDoctors();
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load doctors",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await AppointmentService.createAppointment(formData);
      
      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
      
      navigate("/patient/appointments");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Book Appointment</h1>
          <Button variant="outline" onClick={() => navigate("/patient/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>New Appointment</CardTitle>
            <CardDescription>
              Fill in the details to schedule your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("doctor", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    min={today}
                    required
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Appointment Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  name="reason"
                  required
                  placeholder="Brief reason for your appointment"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information for the doctor"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
