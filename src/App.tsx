import './App.css';
import 'antd/dist/reset.css'; 
import Home from './components/home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from './pages/login';
import { LOGIN_LINK, SIGN_IN_LINK } from './utils/constants';
import { Register } from './pages/signin';

function App() {
  return (
    <div>
     <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={LOGIN_LINK} element={<Login />} />
          <Route path={SIGN_IN_LINK} element={<Register />} />
          {/* <Route path="*" element={<NotFound />} />  */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
