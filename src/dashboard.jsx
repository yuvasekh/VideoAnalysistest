import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchObjects } from './api/api';
import { Table, Input } from 'antd';
import CreateObjectModal from './CreateObject';



const DashBoard = () => {
    const [objectList, setObjectList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        async function readObjects() {
            let response = await fetchObjects();
            console.log(response.data);
            let temp = [];
            if (response?.data) {
                response?.data[0]?.objectList.map((item) => {
                    temp.push({
                        objectType: item.objectType,
                        objectName: item.objectName,
                    });
                });
                console.log(temp);
                setObjectList(temp);
            }
        }
        readObjects();
    }, []);

    const handleViewFields = (objectName) => {
        navigate(`/fields/${objectName}`);
    };

    // Search handler
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // Filter data based on the search query
    const filteredData = objectList.filter((obj) => 
        obj.objectType.toLowerCase().includes(searchText.toLowerCase()) ||
        obj.objectName.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Object Type',
            dataIndex: 'objectType',
            key: 'objectType',
        },
        {
            title: 'Object Name',
            dataIndex: 'objectName',
            key: 'objectName',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <button
                    onClick={() => handleViewFields(record.objectName)}
                    className="bg-white text-black font-semibold px-4 py-1 rounded"
                >
                    View Fields
                </button>
            ),
        },
    ];

    return (
        <div className="w-screen h-screen bg-black text-white p-6">
            <div className="flex justify-between items-center mb-6 gap-10">
                <button
                    className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => navigate('/')}
                >
                    ← Disconnect
                </button>
                <div className=' flex gap-5'>
                <button
                    className="bg-white text-black font-semibold px-4 py-2 rounded"
                    onClick={() => setIsModalVisible(true)} 
                >
                    Create Object
                </button>
                <button
                    className="bg-white text-black font-semibold px-4 py-2 rounded"
                    onClick={() => navigate('/migrations')}
                >
                    Migration
                </button>
                </div>
             
            </div>

            <h1 className="text-3xl font-bold mb-4 text-center">Object Listing</h1>

            <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    📦 Available Objects
                </h2>

                {/* Search Input */}
                <Input
                    placeholder="Search by Object Type or Object Name"
                    value={searchText}
                    onChange={handleSearch}
                    className="mb-4"
                />

                {/* Ant Design Table */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="objectName"
                    pagination={false}
                />
                   {isModalVisible && <CreateObjectModal onClose={() => setIsModalVisible(false)} />}
            </div>
        </div>
    );
};

export default DashBoard;
