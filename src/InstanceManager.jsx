import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addInstance } from './api/api';

const InstanceManager = () => {
    const [instanceUrl, setInstanceUrl] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const navigate = useNavigate();

    const handleConnect = async () => {
        console.log('Connecting to:', instanceUrl);
        console.log('Using access key:', accessKey);
       var res= await addInstance(instanceUrl,accessKey)
       console.log(res.data,"instance")
        // Example: After connecting, navigate to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-black text-white">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Instance Manager</h1>
                <h2 className="text-xl font-semibold mb-2">Instance Setup</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Connect to your instance by providing the URL and access key
                </p>

                <div className="mb-4">
                    <label className="block text-sm mb-2">Instance URL</label>
                    <input
                        type="text"
                        placeholder="https://your-instance.example.com"
                        value={instanceUrl}
                        onChange={(e) => setInstanceUrl(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm mb-2">Access Key</label>
                    <input
                        type="password"
                        placeholder="Your access key"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleConnect}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                    Connect
                </button>
            </div>
        </div>
    );
};

export default InstanceManager;