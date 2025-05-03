import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateFieldModal from './CreateFieldModal';
import axios from 'axios';
import { fetchFieldNames } from './api/api';

const { Option } = Select;

const FieldsListing = () => {
  const { objectName } = useParams();
  console.log(objectName)
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [fields, setFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldTypeFilter, setFieldTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      try {
        const response = await fetchFieldNames(objectName)
        const apiData = response.data;
console.log(apiData,"yuvaapiData")
        const mappedFields = apiData[0]?.fields.map(field => ({
          key: field.fieldName,
          name: field.label || field.fieldName,
          description: '--',
          type: field.dataType || '--',
          fieldType: field.meta?.fieldGroupType || '--',
          mapping: '--',
          lookup: field.meta?.hasLookup ? 'Has Lookup' : '--'
        }));
console.log(mappedFields,"mappedFields")
        setFields(mappedFields);
      } catch (error) {
        console.error('Failed to fetch fields', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [objectName]);


  // Filter fields based on search and field type
  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = fieldTypeFilter ? field.fieldType === fieldTypeFilter : true;
    return matchesSearch && matchesType;
  });

  // Define AntD Table Columns
  const columns = [
    {
      title: 'Field Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span className="text-gray-800 font-medium">{text}</span>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: text => <span className="text-gray-500">{text}</span>,
    },
    {
      title: 'Data Type',
      dataIndex: 'type',
      key: 'type',
      render: text => <Tag color="geekblue" className="rounded-full">{text}</Tag>,
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'Field Type',
      dataIndex: 'fieldType',
      key: 'fieldType',
      filters: [
        { text: 'SYSTEM', value: 'SYSTEM' },
        { text: 'CUSTOM', value: 'CUSTOM' },
        { text: 'STANDARD', value: 'STANDARD' },
      ],
      onFilter: (value, record) => record.fieldType === value,
      render: type => (
        <Tag
          color={
            type === 'SYSTEM' ? 'volcano' :
            type === 'CUSTOM' ? 'green' : 'default'
          }
          className="rounded-full"
        >
          {type}
        </Tag>
      ),
    },
    {
      title: 'Mapping',
      dataIndex: 'mapping',
      key: 'mapping',
      render: text => <span className="text-gray-500">{text}</span>,
    },
    {
      title: 'Lookup',
      dataIndex: 'lookup',
      key: 'lookup',
      render: text => text === 'Has Lookup' ? (
        <Tag color="cyan" className="rounded-full">Has Lookup</Tag>
      ) : (
        <span className="text-gray-400">--</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/objects')}
            className="flex items-center text-gray-600 hover:text-gray-800 border-gray-300 h-10"
          >
            Back to Objects
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowModal(true)}
            className="h-10 bg-blue-600 hover:bg-blue-700 border-none"
          >
            Create Field
          </Button>
        </div>

        {/* Title Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            {objectName} Field Management
          </h1>
          <p className="text-gray-500 mt-2">
            Manage and configure fields for your {objectName} object
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search field name..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10"
            />
            
            <Select
              placeholder="Filter by field type"
              allowClear
              value={fieldTypeFilter || undefined}
              onChange={(value) => setFieldTypeFilter(value)}
              className="min-w-[200px] h-10"
            >
              <Option value="STANDARD">Standard</Option>
              <Option value="SYSTEM">System</Option>
              <Option value="CUSTOM">Custom</Option>
            </Select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredFields}
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: false,
                className: 'px-6 py-4'
              }}
              className="ant-table-striped"
              rowClassName={(record, index) => 
                index % 2 === 0 ? 'bg-gray-50' : ''
              }
            />
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <CreateFieldModal 
            onClose={() => setShowModal(false)} 
            objectName={objectName} 
          />
        )}
      </div>
    </div>
  );
};

export default FieldsListing;