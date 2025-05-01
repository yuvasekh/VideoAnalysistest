import { useState } from 'react';
import { createField } from './api/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Select, Button, Modal, Form } from 'antd';
import { UserOutlined, TagOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const dataTypes = [
  'High Volume',
  'Low Volume'
];

const CreateFieldModal = ({ onClose, objectName }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (values) => {
    if (values.fieldName.startsWith('GS')) {
      toast.error('System fields cannot be created.');
      return;
    }

    setLoading(true);
    try {
      await createField(values.dataType, values.fieldName, values.displayName, objectName);
      toast.success('Field created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating field:', error);
      toast.error('Failed to create field.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold text-gray-800">Create New Field</span>}
      visible={true}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
      className="[&_.ant-modal-content]:rounded-lg [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-gray-200"
    >
      <Form form={form} onFinish={handleCreate} layout="vertical">
        <div className="space-y-6 pt-4">
          <Form.Item
            name="fieldName"
            label="Field Name"
            rules={[{ required: true, message: 'Please enter field name' }]}
          >
            <Input
              placeholder="Enter unique field name"
              prefix={<TagOutlined className="text-gray-400" />}
              className="h-10 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="displayName"
            label="Display Name"
            rules={[{ required: true, message: 'Please enter display name' }]}
          >
            <Input
              placeholder="Enter display name"
              prefix={<UserOutlined className="text-gray-400" />}
              className="h-10 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="dataType"
            label="Data Type"
            rules={[{ required: true, message: 'Please select data type' }]}
          >
            <Select
              placeholder="Select object type"
              className="h-10 rounded-lg"
            >
              {dataTypes.map(type => (
                <Option key={type} value={type}>
                  <span className="text-gray-700">{type}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              className="h-10 px-6 text-gray-700 hover:bg-gray-100 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700 border-none text-white"
            >
              Create Field
            </Button>
          </div>
        </div>
      </Form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        toastClassName="rounded-lg shadow-sm"
      />
    </Modal>
  );
};

export default CreateFieldModal;