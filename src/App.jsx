import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import PrivateLayout from './layouts/PrivateLayout'

// Pages
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Login from './pages/Login'
import Register from './pages/Register'
import AddRoom from './pages/AddRoom'
import MyListings from './pages/MyListings'
import MyBookings from './pages/MyBookings'
import RoomDetails from './pages/RoomDetails'
import EditRoom from './pages/EditRoom'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Private routes */}
          <Route element={<PrivateLayout />}>
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/rooms/:id/edit" element={<EditRoom />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
