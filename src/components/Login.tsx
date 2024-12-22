import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import LoginForm from '../components/LoginPageComponents/LoginForm.tsx';
import {useNavigate} from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {

  const { login} = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {

    try {
      console.log('attempting login');
      await login(email, password);
      console.log('login succesful');
      navigate("/");
    } catch (error) {
      console.error(error);
      alert('Logowanie nie powiodło się');
    }
  };  

  return (
    <>

    <div className='login-container'>
      <div className='login-body'>
        <h1 className="welcome"> Witaj na forum! </h1>
        <h1>Zaloguj się, aby kontynuować</h1> 
        <LoginForm onLogin={handleLogin} /> {/* handleLogin jako prop */}

        <div className='login-not-registered'> Jeśli nie posiadasz konta, zarejstruj się </div>
        <div className='login-register-button'> <button onClick={() => navigate('/register') }> Zarejestruj </button> </div>
      </div>
    </div>
    </>
  );
};

export default Login;
