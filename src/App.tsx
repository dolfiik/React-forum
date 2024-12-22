import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx';
import Register from './components/Register.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Contact from './components/Contact.tsx';

function App() {
  return (
  <AppProvider>
      <Router>
        <Routes>
          <Route path="/"
            element ={
              <ProtectedRoute>
                <Home />
              </ ProtectedRoute>
            }/>
          <Route path="/login" element ={ <Login /> } />
          <Route path="/register" element ={ <Register /> } />
          <Route path="/contact" element ={ <Contact /> } />
        </Routes>
      </Router>
  </AppProvider>
  );
}
export default App
