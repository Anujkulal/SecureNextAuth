import React from 'react'
import { Card, CardFooter, CardHeader } from '../ui/card'
import Header from './Header'
import BackButton from './BackButton'
import { FaExclamationTriangle } from 'react-icons/fa'

const ErrorCard = () => {
  return (
    <Card className='w-[400px] shadow-md'>
        <CardHeader className='flex flex-col items-center'>
            <Header label='Oops! Something went wrong!' />
            <FaExclamationTriangle className='text-destructive' />
        </CardHeader>
        <CardFooter>
            <BackButton 
            label='Go Back to Signin'
            href='/auth/signin'
            />
        </CardFooter>
    </Card>
  )
}

export default ErrorCard