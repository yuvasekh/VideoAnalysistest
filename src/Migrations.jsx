import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Select, message, Progress, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

const objectList = [
  'Customers', 'Orders', 'Products', 'Invoices', 'Employees',
  'Projects', 'Tasks', 'Teams', 'Users'
];

const MigrationPage = () => {
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [sourceObject, setSourceObject] = useState('');
  const [targetObject, setTargetObject] = useState('');
  const [targetObjectsList, setTargetObjectsList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedFields, setFailedFields] = useState([]);
  const [isMigrating, setIsMigrating] = useState(false);

  // Fetch Target Objects
  const fetchTargetObjects = async () => {
    if (!targetUrl || !accessKey) {
      message.error('Please enter Target URL and Access Key');
      return;
    }

    setLoading(true);
    try {
      // Example API request — replace with your actual backend endpoint
      const response = await axios.post(`${targetUrl}/api/objects`, {
        accessKey: accessKey,
      });

      const data = response.data; // assuming it returns an array of object names
      setTargetObjectsList(data || []);
      message.success('Target objects fetched successfully');
    } catch (error) {
      console.error('Error fetching target objects:', error);
      message.error('Failed to fetch target objects');
    } finally {
      setLoading(false);
    }
  };

  const simulateMigration = async (fields) => {
    setIsMigrating(true);
    setLogs(["Starting migration..."]);
    setProgress(0);
    setFailedFields([]);

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay per field

      if (field === 'GS Modified Date') {
        // ❌ Simulate an error for this field
        setLogs(prev => [...prev, `❌ Failed to migrate '${field}' (System Field - Skipped).`]);
        setFailedFields(prev => [...prev, field]);
      } else {
        // ✅ Normal field migration
        setLogs(prev => [...prev, `✅ Successfully migrated field '${field}'.`]);
      }

      setProgress(Math.round(((i + 1) / fields.length) * 100));
    }

    setLogs(prev => [...prev, `🎉 Migration from '${sourceObject}' to '${targetObject}' completed.`]);
    message.success('Migration completed!');
    setIsMigrating(false);
  };

  const handleStartMigration = () => {
    if (!sourceObject || !targetObject || !targetUrl || !accessKey) {
      message.error('Please fill all fields!');
      return;
    }

    // Simulate field migration list
    const fieldsToMigrate = [
      'Customer Name',
      'Email',
      'Billing Address',
      'Created Date',
      'Modified By',
      'Score',
      'GS Modified Date',  // Let's assume this will fail (example of error)
    ];

    simulateMigration(fieldsToMigrate);
  };

  const handleRetryFailedFields = () => {
    if (failedFields.length === 0) {
      message.info('No failed fields to retry.');
      return;
    }

    simulateMigration(failedFields);
  };

  const handleDownloadLogs = () => {
    const element = document.createElement("a");
    const file = new Blob([logs.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `migration_logs_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => navigate('/objects')}
          className="bg-gray-800 text-white border-none hover:bg-gray-700"
        >
          ← Back to Objects
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-10">Field Migration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side Setup */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Migration Setup</h2>
          <p className="text-gray-400 mb-6 text-sm">Provide instance details and map source ➔ target object</p>

          {/* Target Instance Inputs */}
          <Input
            placeholder="Target Instance URL"
            className="mb-4 bg-gray-800 text-white"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Target Access Key"
            className="mb-4 bg-gray-800 text-white"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
          />

          <Button
            type="primary"
            onClick={fetchTargetObjects}
            className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            loading={loading}
          >
            Fetch Target Objects
          </Button>

          {/* Source Object Dropdown */}
          <Select
            showSearch
            placeholder="Select Source Object"
            className="w-full mb-4"
            value={sourceObject || undefined}
            onChange={(value) => setSourceObject(value)}
            filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
          >
            {objectList.map((obj, index) => (
              <Option key={index} value={obj}>{obj}</Option>
            ))}
          </Select>

          {/* Target Object Dropdown */}
          <Select
            showSearch
            placeholder="Select Target Object"
            className="w-full mb-6"
            value={targetObject || undefined}
            onChange={(value) => setTargetObject(value)}
            filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
          >
            {targetObjectsList.map((obj, index) => (
              <Option key={index} value={obj}>{obj}</Option>
            ))}
          </Select>

          {/* Migrate Button */}
          <Button
            onClick={handleStartMigration}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold mb-4"
            disabled={isMigrating}
          >
            Start Migration
          </Button>

          {/* Retry Failed Fields Button */}
          <Button
            onClick={handleRetryFailedFields}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold mb-4"
            disabled={isMigrating || failedFields.length === 0}
          >
            Retry Failed Fields
          </Button>

          {/* Download Logs Button */}
          <Button
            onClick={handleDownloadLogs}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold"
            disabled={logs.length === 0}
          >
            Download Logs
          </Button>
        </div>

        {/* Right Side Logs */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📜 Logs</h2>
          <div className="bg-black p-4 rounded overflow-y-auto h-80 border border-gray-700 text-sm font-mono mb-4">
            {logs.length === 0 ? (
              <p className="text-gray-500">Logs will appear here during migration</p>
            ) : (
              logs.map((log, index) => (
                <p key={index} className="mb-2">{log}</p>
              ))
            )}
          </div>

          {/* Progress Bar */}
          {isMigrating && (
            <Progress percent={progress} status="active" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrationPage;