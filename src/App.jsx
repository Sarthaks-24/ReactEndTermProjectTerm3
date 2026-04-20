import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Analyzer from './pages/Analyzer.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'

function AppLayout() {
	return (
		<div className="min-h-screen bg-ink text-slate-100">
			<Navbar />
			<main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
				<Routes>
					<Route path="/analyzer" element={<Analyzer />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="*" element={<Navigate to="/analyzer" replace />} />
				</Routes>
			</main>
		</div>
	)
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/*"
						element={
							<ProtectedRoute>
								<AppLayout />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}
