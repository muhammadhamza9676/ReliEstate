import React, {useEffect} from 'react';
import { toast } from "react-toastify";

const Login = () => {

    useEffect(() => {
        toast.success("Login successful!");
    }, [])
    
    return (
        <div className='flex items-center justify-center min-w-full h-full'>
            <div className='text-blue-500 text-6xl'>Login Page</div>
        </div>
    )
}

export default Login;
