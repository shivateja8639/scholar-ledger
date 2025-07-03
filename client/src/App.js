import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword'; // ✅ Import this
import ResetPassword from './pages/ResetPassword'; 
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={
          <ProtectedRoutes>
            <Homepage />
          </ProtectedRoutes>
        } />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem('user')) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
