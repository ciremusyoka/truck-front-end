import './App.css';
import 'antd/dist/reset.css'; 
import Home from './components/home';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Login } from './pages/login';
import { API_DOCS_LINK, COMPANIES_LINK, LOGIN_LINK, SIGN_IN_LINK, TRIPS_LINK } from './utils/constants';
import { Register } from './pages/signin';
import AdminLayout from './components/sideLayout';
import {TripsList} from './pages/trips';
import {CompaniesList} from './pages/companies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DriverLogs } from './pages/tripLogger';
import { AddTripLog } from './pages/addTripLog';
import ApiDocs from './pages/docs';
import React from 'react';
import { getAuthToken } from './utils/axiosClient';

const queryClient = new QueryClient();

const ProtectedRoute = ({ allowAll = true }: {allowAll?: boolean}) => {
  const token = getAuthToken()

  if (token ) {
      return <Navigate to={`${TRIPS_LINK}/2`} replace />;
  }

  if(!allowAll) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
     <Router>
        <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path={LOGIN_LINK} element={<Login />} />
          <Route path={SIGN_IN_LINK} element={<Register />} />
        </Route>

          {/* <Route path="*" element={<NotFound />} />  */}
          {/* Admin Layout with Nested Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route path={TRIPS_LINK} element={<TripsList />} />
          <Route path={COMPANIES_LINK} element={<CompaniesList />} />
          <Route path={`${TRIPS_LINK}/:id`} element={<DriverLogs />} />
          <Route path={`${TRIPS_LINK}/:id/add-log`} element={<AddTripLog />} />
          <Route path={API_DOCS_LINK} element={<ApiDocs />} />
        </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
