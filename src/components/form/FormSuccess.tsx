import { CheckCircleIcon } from 'lucide-react'
import React from 'react'

interface FormSuccessProps {
    message?: string;
}

const FormSuccess = ({message}:FormSuccessProps) => {
    if (!message) return null;
  return (
    <div className='bg-green-500/15 p-3 rounded-md flex items-center gap-x-2 text-green-500 text-sm'>
        <CheckCircleIcon className='h-4 w-4' />
        {message}
    </div>
  )
}

export default FormSuccess