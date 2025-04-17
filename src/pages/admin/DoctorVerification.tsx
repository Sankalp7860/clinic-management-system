
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Eye, UserCheck, UserX } from "lucide-react";

interface DoctorVerification {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  gender: string;
  registrationDate: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState<DoctorVerification[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorVerification | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  useEffect(() => {
    // Simulate fetching doctor verification requests from backend
    const fetchDoctors = async () => {
      try {
        // This would connect to your backend API
        // const response = await fetch('http://localhost:8000/api/admin/doctor-verifications');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockDoctors: DoctorVerification[] = [
          {
            id: "1",
            name: "Dr. Mark Johnson",
            email: "mark.johnson@example.com",
            phone: "+1 (555) 123-4567",
            specialization: "Cardiologist",
            experience: "10 years",
            gender: "Male",
            registrationDate: "2025-04-16",
            status: "pending"
          },
          {
            id: "2",
            name: "Dr. Lisa Wong",
            email: "lisa.wong@example.com",
            phone: "+1 (555) 987-6543",
            specialization: "Neurologist",
            experience: "15 years",
            gender: "Female",
            registrationDate: "2025-04-15",
            status: "pending"
          },
          {
            id: "3",
            name: "Dr. James Thompson",
            email: "james.thompson@example.com",
            phone: "+1 (555) 456-7890",
            specialization: "Orthopedic",
            experience: "8 years",
            gender: "Male",
            registrationDate: "2025-04-14",
            status: "pending"
          },
          {
            id: "4",
            name: "Dr. Sarah Chen",
            email: "sarah.chen@example.com",
            phone: "+1 (555) 234-5678",
            specialization: "Pediatrician",
            experience: "12 years",
            gender: "Female",
            registrationDate: "2025-04-10",
            status: "approved",
            notes: "Excellent credentials. Verified medical license."
          },
          {
            id: "5",
            name: "Dr. Robert Davis",
            email: "robert.davis@example.com",
            phone: "+1 (555) 876-5432",
            specialization: "Dermatologist",
            experience: "6 years",
            gender: "Male",
            registrationDate: "2025-04-09",
            status: "rejected",
            notes: "Unable to verify medical license. Incomplete documentation."
          }
        ];
        
        setDoctors(mockDoctors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor verifications:", error);
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // Handle approving a doctor
  const handleApproveDoctor = (id: string) => {
    // This would connect to your backend API
    // In a real app, you would make an API call to approve the doctor
    
    // For now, update locally
    setDoctors(doctors.map(doctor => 
      doctor.id === id 
        ? { ...doctor, status: "approved", notes: "Approved on " + new Date().toLocaleDateString() } 
        : doctor
    ));
    
    toast.success("Doctor approved successfully");
  };

  // Handle rejecting a doctor
  const handleRejectDoctor = () => {
    if (!selectedDoctor) return;
    
    // This would connect to your backend API
    // In a real app, you would make an API call to reject the doctor
    
    // For now, update locally
    setDoctors(doctors.map(doctor => 
      doctor.id === selectedDoctor.id 
        ? { ...doctor, status: "rejected", notes: rejectionReason } 
        : doctor
    ));
    
    setDialogOpen(false);
    setRejectionReason("");
    toast.success("Doctor rejected successfully");
  };

  // Open the rejection dialog
  const openRejectDialog = (doctor: DoctorVerification) => {
    setSelectedDoctor(doctor);
    setDialogOpen(true);
  };

  // Filter doctors based on search query, status, and tab
  const filterDoctors = (status: "pending" | "approved" | "rejected" | "all") => {
    return doctors
      .filter(doctor => 
        status === "all" ? true : doctor.status === status
      )
      .filter(doctor => 
        statusFilter === "all" 
          ? true 
          : doctor.status === statusFilter
      )
      .filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const allDoctors = filterDoctors("all");
  const pendingDoctors = filterDoctors("pending");
  const approvedDoctors = filterDoctors("approved");
  const rejectedDoctors = filterDoctors("rejected");

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Verification</h1>
          <p className="text-muted-foreground">
            Review and approve new doctor registrations
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or specialization..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Doctor Verification Requests</CardTitle>
            <CardDescription>
              {pendingDoctors.length > 0 
                ? `${pendingDoctors.length} doctors awaiting verification`
                : "No pending verification requests"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">
                    Pending ({pendingDoctors.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved ({approvedDoctors.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({rejectedDoctors.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="space-y-4 mt-4">
                  {pendingDoctors.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No pending doctor verification requests
                    </div>
                  ) : (
                    pendingDoctors.map((doctor) => (
                      <div 
                        key={doctor.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h3 className="font-medium">{doctor.name}</h3>
                            <Badge variant="outline" className="md:ml-2">
                              {doctor.specialization}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{doctor.email} • {doctor.phone}</p>
                          <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-muted-foreground">
                            <span>Experience: {doctor.experience}</span>
                            <span>Gender: {doctor.gender}</span>
                            <span>Registered: {new Date(doctor.registrationDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button 
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveDoctor(doctor.id)}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => openRejectDialog(doctor)}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="approved" className="space-y-4 mt-4">
                  {approvedDoctors.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No approved doctors found
                    </div>
                  ) : (
                    approvedDoctors.map((doctor) => (
                      <div 
                        key={doctor.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h3 className="font-medium">{doctor.name}</h3>
                            <Badge variant="outline" className="md:ml-2">
                              {doctor.specialization}
                            </Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <UserCheck className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{doctor.email} • {doctor.phone}</p>
                          <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-muted-foreground">
                            <span>Experience: {doctor.experience}</span>
                            <span>Gender: {doctor.gender}</span>
                          </div>
                          {doctor.notes && (
                            <p className="text-sm mt-2 italic">
                              "{doctor.notes}"
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="rejected" className="space-y-4 mt-4">
                  {rejectedDoctors.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No rejected doctors found
                    </div>
                  ) : (
                    rejectedDoctors.map((doctor) => (
                      <div 
                        key={doctor.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h3 className="font-medium">{doctor.name}</h3>
                            <Badge variant="outline" className="md:ml-2">
                              {doctor.specialization}
                            </Badge>
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <UserX className="mr-1 h-3 w-3" />
                              Rejected
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{doctor.email} • {doctor.phone}</p>
                          <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-muted-foreground">
                            <span>Experience: {doctor.experience}</span>
                            <span>Gender: {doctor.gender}</span>
                          </div>
                          {doctor.notes && (
                            <p className="text-sm mt-2 text-red-600">
                              <span className="font-medium">Reason for rejection:</span> {doctor.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button 
                            size="sm"
                            className="gap-1"
                            onClick={() => handleApproveDoctor(doctor.id)}
                          >
                            Reconsider
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
      
      {/* Rejection Reason Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Doctor Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this doctor's application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="rejection-reason" className="text-sm font-medium">
                Rejection Reason
              </label>
              <Input
                id="rejection-reason"
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectDoctor} disabled={!rejectionReason.trim()}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorVerification;
