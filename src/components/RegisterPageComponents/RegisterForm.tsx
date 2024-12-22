import React, { useState } from 'react';
import '../Register.css';


interface RegisterFormProps {
  onSignup: (username: string, email: string, password: string) => void; // prop do oblsugi rejestracji
};

const RegisterForm: React.FC<RegisterFormProps> = ( {onSignup} ) => {
 
  const [ username, setUsername] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Username:", username);

    if(!isValidEmail(email)) {
      alert("podaj prawidlowy adres email");
      return;
    }

    onSignup(username, email, password); // wywwolanie propu
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
  <form onSubmit={handleSubmit}>
    <h2>Zarejestruj</h2>
    <div className='register-username'>
      <label htmlFor='username'>Nazwa użytkownika</label> <br />
      <input type='text' placeholder='Wprowadź nazwę użytkownika' value={username} onChange={(e) => setUsername(e.target.value)} required/>
    </div>
    <div className='register-email'>
      <label htmlFor="email">Email</label>
      <input type="email"  placeholder="Wprowadź email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
    </div>
    <div className='register-password'>
     <label htmlFor="password">Hasło</label>
     <input type="password"  placeholder="Wprowadź login" value={password} onChange={(e) => setPassword(e.target.value)} required/>
    </div>
    <button className="register-button" type="submit">Zarejestruj</button>
  </form>
  );
};


export default RegisterForm;
