import React, {useState} from 'react';
import '../Login.css'

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ( {onLogin}) => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email,password);
  };


 return (
  <>
  <form onSubmit={handleSubmit}>
    <h2> Login </h2>
    <div className = "login-email">
      <label htmlFor="email">Email</label>
      <input type="email"  placeholder="Wprowadź email" onChange={(e) => setEmail(e.target.value)} required/>
    </div>
    <div className ="login-password">
     <label htmlFor="password">Hasło</label>
     <input type="password" placeholder="Wprowadź login" onChange={(e) => setPassword(e.target.value)} required/>
    </div>

    <button className='login-button' type="submit">Zaloguj</button>
  </form>
  </>
 );
}

export default LoginForm;
