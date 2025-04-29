import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Spin } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import CreateFieldModal from './CreateFieldModal';
import axios from 'axios';
import { fetchFieldNames } from './api/api';

const { Option } = Select;

const FieldsListing = () => {
  const { objectName } = useParams();
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span className="text-blue-400">{text}</span>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Data Type',
      dataIndex: 'type',
      key: 'type',
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
        <span
          className={`px-2 py-1 rounded text-xs ${
            type === 'SYSTEM' ? 'bg-yellow-500' :
            type === 'CUSTOM' ? 'bg-green-500' :
            'bg-gray-500'
          } text-white`}
        >
          {type}
        </span>
      ),
    },
    {
      title: 'Mapping',
      dataIndex: 'mapping',
      key: 'mapping',
    },
    {
      title: 'Lookup',
      dataIndex: 'lookup',
      key: 'lookup',
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-black text-white p-6">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/objects')}
          className="bg-gray-800 hover:bg-gray-700 text-white border-none"
        >
          Back to Objects
        </Button>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Create Field
        </Button>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-10 text-center">{objectName} Fields</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search Field Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3"
        />

        <Select
          placeholder="Filter Field Type"
          allowClear
          value={fieldTypeFilter || undefined}
          onChange={(value) => setFieldTypeFilter(value)}
          className="w-full md:w-1/4"
        >
          <Option value="STANDARD">STANDARD</Option>
          <Option value="SYSTEM">SYSTEM</Option>
          <Option value="CUSTOM">CUSTOM</Option>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredFields}
            pagination={{ pageSize: 10 }}
            className="bg-gray-900 text-white"
          />
        )}
      </div>

      {/* Modal */}
      {showModal && <CreateFieldModal onClose={() => setShowModal(false)} objectName={objectName} />}
    </div>
  );
};

export default FieldsListing;
