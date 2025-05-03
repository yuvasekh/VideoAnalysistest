import { useState } from 'react';
import { createField } from './api/api';
import { toast } from 'react-toastify';  // Import toast
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for styling

const dataTypes = [
  'String', 'Number', 'Boolean', 'Date', 'DateTime',
  'Dropdown List', 'Email', 'Percentage', 'Currency',
  'GS ID', 'Rich Text Area', 'Multi Select Dropdown List', 'Who ID', 'Url'
];

const CreateFieldModal = ({ onClose, objectName }) => {
  console.log(objectName,"objectName")
  const [fieldName, setFieldName] = useState('');
  const [dataType, setDataType] = useState('');

  const handleCreate = async () => {
    if (!fieldName || !dataType) {
      alert('Please fill all fields!');
      return;
    }
    if (fieldName.startsWith('GS')) {
      alert('System fields cannot be created.');
      return;
    }
    console.log('Creating field:', { fieldName, dataType });
    
    try {
      const response = await createField(dataType, fieldName, objectName);
      toast.success('Field created successfully!');  // Show success toast
      onClose();
    } catch (error) {
      console.error('Error creating field:', error);
      toast.error('Failed to create field.');  // Show error toast
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Field</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>✖</button>
        </div>
        <p className="text-gray-400 mb-4 text-sm">Add a new field to this object. Field name must be unique.</p>
       
        <input
          type="text"
          placeholder="Field Name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        />
       
        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        >
          <option value="">Select data type</option>
          {dataTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          onClick={handleCreate}
        >
          Create Field
        </button>
      </div>
    </div>
  );
};

export default CreateFieldModal;
