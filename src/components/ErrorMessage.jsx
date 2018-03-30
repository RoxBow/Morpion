import React from 'react';
import '../styles/ErrorMessage.css';


const ErrorMessage = ({ error }) =>
    <p className='errorMessage'>{error}</p>

export default ErrorMessage;
