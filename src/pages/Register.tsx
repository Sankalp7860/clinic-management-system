
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hospital, ArrowLeft } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Patient registration state
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "male"
  });
  
  // Doctor registration state
  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialization: "",
    experience: "",
    gender: "male"
  });

  // Update patient form fields
  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value
    });
  };

  // Update doctor form fields
  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value
    });
  };

  // Set gender for either patient or doctor
  const handleGenderChange = (value: string, userType: 'patient' | 'doctor') => {
    if (userType === 'patient') {
      setPatientData({
        ...patientData,
        gender: value
      });
    } else {
      setDoctorData({
        ...doctorData,
        gender: value
      });
    }
  };

  // Handle patient registration
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (patientData.password !== patientData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would connect to your backend API
      // const response = await fetch('http://localhost:8000/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...patientData, role: 'patient' }),
      // });
      
      // const data = await response.json();
      
      // For now, simulate successful registration
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Registration successful! You can now login.");
        navigate("/login");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  // Handle doctor registration
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (doctorData.password !== doctorData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would connect to your backend API
      // const response = await fetch('http://localhost:8000/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...doctorData, role: 'doctor', isVerified: false }),
      // });
      
      // const data = await response.json();
      
      // For now, simulate successful registration
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Registration submitted! Administrator will verify your account.");
        navigate("/login");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4" 
          asChild
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
        
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <Hospital className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Choose your role and register for our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="doctor">Doctor</TabsTrigger>
              </TabsList>
              
              {/* Patient Registration Form */}
              <TabsContent value="patient">
                <form onSubmit={handlePatientSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name">Full Name</Label>
                      <Input 
                        id="patient-name" 
                        name="name"
                        value={patientData.name}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-gender">Gender</Label>
                      <Select
                        value={patientData.gender}
                        onValueChange={(value) => handleGenderChange(value, 'patient')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-email">Email</Label>
                      <Input 
                        id="patient-email" 
                        name="email"
                        type="email"
                        value={patientData.email}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-phone">Phone Number</Label>
                      <Input 
                        id="patient-phone" 
                        name="phone"
                        type="tel"
                        value={patientData.phone}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-age">Age</Label>
                    <Input 
                      id="patient-age" 
                      name="age"
                      type="number"
                      value={patientData.age}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input 
                      id="patient-password" 
                      name="password"
                      type="password"
                      value={patientData.password}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-confirm-password">Confirm Password</Label>
                    <Input 
                      id="patient-confirm-password" 
                      name="confirmPassword"
                      type="password"
                      value={patientData.confirmPassword}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register as Patient"}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Doctor Registration Form */}
              <TabsContent value="doctor">
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-name">Full Name</Label>
                      <Input 
                        id="doctor-name" 
                        name="name"
                        value={doctorData.name}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-gender">Gender</Label>
                      <Select
                        value={doctorData.gender}
                        onValueChange={(value) => handleGenderChange(value, 'doctor')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-email">Email</Label>
                      <Input 
                        id="doctor-email" 
                        name="email"
                        type="email"
                        value={doctorData.email}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-phone">Phone Number</Label>
                      <Input 
                        id="doctor-phone" 
                        name="phone"
                        type="tel"
                        value={doctorData.phone}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-specialization">Specialization</Label>
                      <Input 
                        id="doctor-specialization" 
                        name="specialization"
                        value={doctorData.specialization}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-experience">Experience (years)</Label>
                      <Input 
                        id="doctor-experience" 
                        name="experience"
                        type="number"
                        value={doctorData.experience}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input 
                      id="doctor-password" 
                      name="password"
                      type="password"
                      value={doctorData.password}
                      onChange={handleDoctorChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-confirm-password">Confirm Password</Label>
                    <Input 
                      id="doctor-confirm-password" 
                      name="confirmPassword"
                      type="password"
                      value={doctorData.confirmPassword}
                      onChange={handleDoctorChange}
                      required
                    />
                  </div>
                  <div className="text-sm text-amber-600 mb-2">
                    Note: Your account will need to be verified by an administrator before you can login.
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Register as Doctor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
