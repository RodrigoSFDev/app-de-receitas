import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [atived, setAtived] = useState(true);

  const history = useHistory();
  const minimo = 7;
  const senhaCorreta = password.length >= minimo;
  const emailCorreto = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
  const disabled = !(senhaCorreta && emailCorreto);

  useEffect(() => {
    setAtived(disabled);
  }, [disabled]);
  const handleClick = () => {
    const storageEmail = {
      email,
    };
    localStorage.setItem('user', JSON.stringify(storageEmail));

    history.push('/meals');
  };
  return (
    <div className="login">
      <h1>Login</h1>
      <label htmlFor="email">
        Email:
        <input
          type="email"
          id="email"
          data-testid="email-input"
          placeholder="example@example.com"
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
        />
      </label>
      <label htmlFor="password">
        Senha:
        <input
          type="password"
          id="password"
          data-testid="password-input"
          placeholder="7+ characters"
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
        />
      </label>
      <button
        data-testid="login-submit-btn"
        onClick={ handleClick }
        disabled={ atived }
      >
        Enter

      </button>
    </div>
  );
}

export default Login;
