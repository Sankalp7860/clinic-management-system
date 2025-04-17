
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Hospital } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-3xl px-4">
        <div className="flex justify-center mb-6">
          <Hospital className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-blue-900">MediCare Hospital Management System</h1>
        <p className="text-xl text-gray-600 mb-8">
          An integrated platform for patients, doctors, and administrators to streamline healthcare services
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
