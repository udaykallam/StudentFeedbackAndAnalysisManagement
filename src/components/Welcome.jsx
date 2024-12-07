import React from 'react'
import { useAuth } from '../store/AuthContext'

const Welcome = () => {

    const {user} = useAuth();

  return (
    <>
    <h1>
    {user ? `Hii, ${user.student.name}. Welcome to Feedback Management Website` : `Welcome to Feedback Management Website`}
    </h1>
    </>
  )
}

export default Welcome