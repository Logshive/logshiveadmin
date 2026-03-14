import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccountList from './pages/Accounts/AccountList';
import AccountCreate from './pages/Accounts/AccountCreate';
import AccountEdit from './pages/Accounts/AccountEdit';
import UserList from './pages/Users/UserList';
import UserCreate from './pages/Users/UserCreate';
import UserEdit from './pages/Users/UserEdit';
import OrderList from './pages/Orders/OrderList';
import Settings from './pages/Settings';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Account Routes - Full CRUD */}
          <Route path="accounts">
            <Route index element={<AccountList />} />
            <Route path="create" element={<AccountCreate />} />
            <Route path="edit/:id" element={<AccountEdit />} />
          </Route>
          
          {/* User Routes - Full CRUD */}
          <Route path="users">
            <Route index element={<UserList />} />
            <Route path="create" element={<UserCreate />} />
            <Route path="edit/:id" element={<UserEdit />} />
          </Route>
          
          {/* Other Routes */}
          <Route path="orders" element={<OrderList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;