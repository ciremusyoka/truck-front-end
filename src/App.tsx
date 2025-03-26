import './App.css';
import 'antd/dist/reset.css'; 
import Home from './components/home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from './pages/login';
import { COMPANIES_LINK, LOGIN_LINK, SIGN_IN_LINK, TRIPS_LINK } from './utils/constants';
import { Register } from './pages/signin';
import AdminLayout from './components/sideLayout';
import {TripsList} from './pages/trips';
import {CompaniesList} from './pages/companies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DriverLogs } from './pages/tripLogger';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
     <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={LOGIN_LINK} element={<Login />} />
          <Route path={SIGN_IN_LINK} element={<Register />} />
          {/* <Route path="*" element={<NotFound />} />  */}
          {/* Admin Layout with Nested Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route path={TRIPS_LINK} element={<TripsList />} />
          <Route path={COMPANIES_LINK} element={<CompaniesList />} />
          <Route path={`${TRIPS_LINK}/:id`} element={<DriverLogs />} />
        </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
