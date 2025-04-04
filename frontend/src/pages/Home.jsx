import React from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();  // Hook to navigate between pages

    const handleGoToDashboard = () => {
        navigate('/dashboard');  // Navigate to the Dashboard (if not already on it)
    };

    const handleGoToLogin = () => {
        navigate('/login');  // Navigate to the Login page
    };
    return (
        <>
            <div className='flex items-center justify-center min-w-full h-full'>
                <div className='text-red-500 text-6xl'>Welcome to Home Page</div>
            </div>
            <div className="mt-4">
                {/* Button to go to Dashboard */}
                <button
                    onClick={handleGoToDashboard}
                    className="bg-blue-500 text-black p-2 rounded mr-4"
                >
                    Go to Dashboard
                </button>

                {/* Button to go to Login */}
                <button
                    onClick={handleGoToLogin}
                    className="bg-red-500 text-black p-2 rounded"
                >
                    Go to Login
                </button>
            </div>
        </>
    )
}

export default Home
