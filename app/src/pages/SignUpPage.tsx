import React from 'react';
import { Link } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  return (
    <div className='signup-container'>
      <h1>Sign Up Page</h1>
      <p>This is the signup page. You can implement the signup form here.</p>
      <Link to='/login'>Back to Login</Link>
    </div>
  );
};

export default SignUpPage;
