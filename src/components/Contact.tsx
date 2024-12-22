import React, {useState} from 'react';
import './Contact.css';
import './ContactMsg.css';


const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject:'',
    message:'',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!formData.email || !formData.message) {
      setError('Email and message are required');
      return;
    }

    try {
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error(error); 
    }
  };


  if(isSubmitted) {
    return (
       <div className='contact-feedback-container'>
          <div className='contact-feedback-body'>
            <h2>Dziekuję za wysłanie wiadomości</h2>
            <p>Możesz oczekiwać odpowiedzi w najbliższych dniach </p>
          </div>
        </div>
    );
  }

    return (
      <div className='contact-container'>
        <div className='contact-body'>
          <h1>Skontaktuj się z nami!</h1>
          {error && <div className='error-message'>{error}</div>}
          <form onSubmit={handleSubmit} className='contact-form'>
            <div className='contact-name'>
              <label htmlFor='name'>Imię</label>
              <input type='text'id='name' name='name'value={formData.name} onChange={handleChange} placeholder='Podaj imię (opcjonalne)'/>
            </div>
            <div className='contact-email'>
              <label htmlFor='email'>Email*</label>
              <input type='email'id='email' name='email' value={formData.email} onChange={handleChange} placeholder='Podaj adres email' required />
            </div>
          <div className='contact-message'>
            <label htmlFor='messasge'>Wiadomość*</label>
            <textarea id='message' name='message' value={formData.message} onChange={handleChange} placeholder='Wiadomość...' rows={5} required />
          </div>
          <button type='submit' className='contact-submit'>
            Wyślij
          </button>
        </form>
    </div>
  </div>
  );
};

export default Contact;

