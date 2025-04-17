import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import PatientDashboard from "@/pages/patient/Dashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import DoctorDashboard from "@/pages/doctor/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import AuthService from "@/services/auth.service";
import Profile from "@/pages/patient/Profile";
import Appointments from "@/pages/patient/Appointments";
import DoctorAppointments from "./pages/doctor/AppointmentsList";
import DoctorProfile from "@/pages/doctor/Profile";

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
	const currentUser = AuthService.getCurrentUser();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
		return <Navigate to="/" />;
	}

	return children;
};

function App() {
	return (
		<Router>
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<Index />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Patient routes */}
				<Route
					path="/patient/dashboard"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<PatientDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/patient/book-appointment"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<BookAppointment />
						</ProtectedRoute>
					}
				/>

				{/* Patient routes */}
				<Route
					path="/patient/profile"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/patient/appointments"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<Appointments />
						</ProtectedRoute>
					}
				/>

				{/* Doctor routes */}
				<Route
					path="/doctor/dashboard"
					element={
						<ProtectedRoute allowedRoles={["doctor"]}>
							<DoctorDashboard />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/doctor/appointments"
					element={
						<ProtectedRoute allowedRoles={["doctor"]}>
							<DoctorAppointments />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/doctor/profile"
					element={
						<ProtectedRoute allowedRoles={["doctor"]}>
							<DoctorProfile />
						</ProtectedRoute>
					}
				/>

				{/* Admin routes */}
				<Route
					path="/admin/dashboard"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>

				{/* Catch all */}
				<Route path="*" element={<NotFound />} />
			</Routes>
			<Toaster />
		</Router>
	);
}

export default App;
