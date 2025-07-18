import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

interface FormErrorProps {
    message?: string;
}

const FormError = ({message}: FormErrorProps) => {
    if(!message) return null;
    
  return (
    <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive text-sm'>
        <FaExclamationTriangle className='h-4 w-4' />
        <p>{message}</p>
    </div>
  )
}

export default FormError