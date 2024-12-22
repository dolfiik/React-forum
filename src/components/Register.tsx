import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import RegisterForm from '../components/RegisterPageComponents/RegisterForm.tsx';
import { useNavigate } from 'react-router-dom';
import './Register.css'

const Register: React.FC = () => {

  const { signup } = useAppContext();
  const navigate = useNavigate();

  const handleSignup = async (username: string, email: string , password: string) => {
    try {
      await signup(username,email,password);
      navigate('/login'); // po pomyslnym zarejestrowaniu przekieruj na login
    } catch (error) {
      console.error(error);
      alert("Nie udalo sie zarejestrowac");
    }
 };


  return (
  <div className='register-container'>
    <div className='register-body'>
      <h1> Strona rejestracji </h1>
      <RegisterForm onSignup={handleSignup} /> { /* przekazanie funkcji handleSignup jako prop */ }
    </div>
  </div>
  );
};

export default Register; 
