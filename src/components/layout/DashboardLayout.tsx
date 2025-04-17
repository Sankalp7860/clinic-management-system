
import { useState, ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import { Hospital, Menu, LogOut, User, Calendar, Users, ChevronRight, Home, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "patient" | "doctor" | "admin";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const getNavItems = (): NavItem[] => {
    switch (userRole) {
      case "patient":
        return [
          { title: "Dashboard", href: "/patient/dashboard", icon: <Home size={20} /> },
          { title: "Book Appointment", href: "/patient/book-appointment", icon: <Calendar size={20} /> },
          { title: "My Appointments", href: "/patient/appointments", icon: <Calendar size={20} /> },
          { title: "Profile", href: "/patient/profile", icon: <User size={20} /> },
        ];
      case "doctor":
        return [
          { title: "Dashboard", href: "/doctor/dashboard", icon: <Home size={20} /> },
          { title: "Appointments", href: "/doctor/appointments", icon: <Calendar size={20} /> },
          { title: "Profile", href: "/doctor/profile", icon: <User size={20} /> },
        ];
      case "admin":
        return [
          { title: "Dashboard", href: "/admin/dashboard", icon: <Home size={20} /> },
          { title: "Verify Doctors", href: "/admin/verify-doctors", icon: <Users size={20} /> },
          { title: "Manage Patients", href: "/admin/patients", icon: <Users size={20} /> },
          { title: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleTitle = (): string => {
    switch (userRole) {
      case "patient":
        return "Patient Portal";
      case "doctor":
        return "Doctor Portal";
      case "admin":
        return "Admin Portal";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px] p-0">
                <div className="flex flex-col h-full">
                  <div className="border-b py-4 px-5">
                    <div className="flex items-center gap-2">
                      <Hospital className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold text-lg">MediCare</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{getRoleTitle()}</div>
                  </div>
                  <nav className="flex-1 overflow-auto py-2">
                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.href}
                        className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-gray-100 ${
                          location.pathname === item.href
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t p-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="w-full justify-start gap-2 text-red-600"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link to={`/${userRole}/dashboard`} className="flex items-center gap-2">
              <Hospital className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-lg hidden md:block">MediCare</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-red-600 hidden md:flex"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop only) */}
        <aside className="w-64 border-r border-gray-200 hidden md:block">
          <div className="h-full flex flex-col pt-5">
            <div className="px-5 mb-6">
              <h2 className="text-lg font-semibold">{getRoleTitle()}</h2>
            </div>
            <nav className="flex-1 overflow-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex items-center justify-between px-5 py-3 text-sm transition-colors hover:bg-gray-100 ${
                    location.pathname === item.href
                      ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </div>
                  {location.pathname === item.href && <ChevronRight size={16} />}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

// Update the doctor sidebar links to include the profile link
// Look for the section that defines the doctor sidebar links and add:
const doctorLinks = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
  { href: "/doctor/appointments", label: "Appointments", icon: <Calendar className="h-4 w-4" /> },
  { href: "/doctor/profile", label: "My Profile", icon: <User className="h-4 w-4" /> },
];
