import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Select, Progress, Card, Tag, Row, Col, Alert, Spin, message } from 'antd';
import {
  ArrowLeftOutlined,
  CloudSyncOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SafetyCertificateOutlined,
  LinkOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { createMigration, fetchObjects } from './api/api';

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
      const response = await fetchObjects();
      const temp = response?.data?.[0]?.objectList?.map(item => item.objectName) || [];
      console.log(temp)
      setTargetObjectsList(temp);
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

  const handleStartMigration = async () => {
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
    try {
     var res= await createMigration(sourceObject, targetObject, targetUrl, accessKey)
     console.log(res,"yuva")
    }
    catch (err) {

    }

  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Navigation */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/objects')}
          className="mb-6 text-gray-600 hover:text-blue-600"
        >
          Back to Objects
        </Button>

        {/* Main Title Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <CloudSyncOutlined className="text-blue-600" />
            Data Migration Center
          </h1>
          <p className="text-gray-500">Securely transfer object configurations between instances</p>
        </div>

        {/* Migration Dashboard */}
        <Row gutter={[24, 24]}>
          {/* Configuration Panel */}
          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-0">
              <div className="space-y-6">
                {/* Connection Status */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <SafetyCertificateOutlined className="text-blue-600 text-lg" />
                    <div>
                      <h3 className="font-medium text-gray-800">Secure Connection</h3>
                      <p className="text-sm text-gray-500">TLS 1.3 encrypted migration</p>
                    </div>
                  </div>
                </div>

                {/* Target Configuration */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Target Instance</h3>
                  <Input
                    addonBefore={<LinkOutlined className="text-gray-400" />}
                    placeholder="https://target.instance.com"
                    className="h-12 rounded-lg"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                  />
                  <Input.Password
                    addonBefore={<SafetyCertificateOutlined className="text-gray-400" />}
                    placeholder="Access key"
                    className="h-12 rounded-lg"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                  />
                </div>

                {/* Object Mapping */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Object Mapping</h3>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Select
                        placeholder="Target object"
                        onChange={(value) => setSourceObject(value)}
                        className="w-full h-12"
                        isDisabled={targetObjectsList.length === 0}
                        options={targetObjectsList.map(name => ({
                          label: name,  // Format names to be more readable
                          value: name
                        }))}
                        showSearch  // Add this line to enable search functionality
                      />
                    </Col>
                    <Col span={12}>
                      {console.log(
                        targetObjectsList.map(name => ({
                          label: name,  // Format names to be more readable
                          value: name
                        }))
                      )}
                      <Select
                        placeholder="Target object"
                        className="w-full h-12"
                        onChange={(value) => setTargetObject(value)}
                        isDisabled={targetObjectsList.length === 0}
                        options={targetObjectsList.map(name => ({
                          label: name,  // Format names to be more readable
                          value: name
                        }))}
                        showSearch  // Add this line to enable search functionality
                      />

                    </Col>
                  </Row>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="primary"
                    icon={<CloudSyncOutlined />}
                    className="h-12"
                    loading={loading}
                    onClick={fetchTargetObjects}
                  >
                    Discover Targets
                  </Button>
                  <Button
                    type="default"
                    className="h-12"
                    onClick={() => setTargetObjectsList([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          {/* Migration Progress */}
          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-0 h-full">
              <div className="space-y-6 h-full flex flex-col">
                {/* Migration Controls */}
                <div className="space-y-4">
                  <Button
                    type="primary"
                    block
                    size="large"
                    className="h-12 bg-green-600 hover:bg-green-700"
                    onClick={handleStartMigration}
                    disabled={!sourceObject || !targetObject}
                  >
                    Initiate Migration
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      icon={<ReloadOutlined />}
                      className="h-10"
                      disabled={failedFields.length === 0}
                    >
                      Retry Failed ({failedFields.length})
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      className="h-10"
                      disabled={logs.length === 0}
                    >
                      Export Logs
                    </Button>
                  </div>
                </div>

                {/* Migration Visualizer */}
                <div className="flex-1">
                  {isMigrating ? (
                    <div className="space-y-4">
                      <Progress
                        percent={progress}
                        strokeColor={{
                          '0%': '#4F46E5',
                          '100%': '#10B981',
                        }}
                        strokeWidth={8}
                        showInfo={false}
                      />
                      <div className="text-center">
                        <div className="text-lg font-medium text-gray-800">
                          Migrating {sourceObject}
                          <span className="mx-2">→</span>
                          {targetObject}
                        </div>
                        <p className="text-gray-500 text-sm">
                          Processing {progress}% complete
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <FileTextOutlined className="text-4xl mr-3" />
                      <span>Migration session will appear here</span>
                    </div>
                  )}
                </div>

                {/* Logs Preview */}
                {logs.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Recent Activity</h4>
                      <Tag color="blue">{logs.length} events</Tag>
                    </div>
                    <div className="space-y-2 h-32 overflow-y-auto">
                      {logs.slice(-3).map((log, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded ${log.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                            }`}
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MigrationPage;