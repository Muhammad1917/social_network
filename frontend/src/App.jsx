import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';
import { Button } from './components/ui/button';

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto mt-20 grid w-full max-w-md gap-6 text-center">
      <h1 className="text-2xl font-bold">Social Network</h1>
      {user ? (
        <div className="flex flex-col gap-4">
          <p>Welcome, {user.username}!</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Button onClick={logout} variant="outline">Logout</Button>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          <Link to="/login"><Button>Login</Button></Link>
          <Link to="/register"><Button variant="outline">Register</Button></Link>
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="mt-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
