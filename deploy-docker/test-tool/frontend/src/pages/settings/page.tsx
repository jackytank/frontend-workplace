import React, { useState, useEffect } from 'react';
import { Table, Button, Radio, Select, Form, Input, Popconfirm, Divider, notification } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { constants } from '../../utils/constants';

export interface AwsProfile {
    key: string;
    aws_access_key_id: string;
    aws_secret_access_key: string;
    region: string;
}

const SettingsPage: React.FC = () => {
    const [profiles, setProfiles] = useState<AwsProfile[]>([]);
    const [selectedProfileKey, setSelectedProfileKey] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [visibleSecretKey, setVisibleSecretKey] = useState<string | null>(null);
    useEffect(() => {
        const savedProfiles = JSON.parse(localStorage.getItem(constants.localStorageKey.awsProfiles) || '[]');
        setProfiles(savedProfiles);
        const savedSelectedProfile = localStorage.getItem(constants.localStorageKey.selectedProfileKey);
        setSelectedProfileKey(savedSelectedProfile);
    }, []);

    const handleAddProfile = (values: AwsProfile) => {
        const newProfile = { ...values, key: Date.now().toString() };
        const updatedProfiles = [...profiles, newProfile];
        setProfiles(updatedProfiles);
        localStorage.setItem(constants.localStorageKey.awsProfiles, JSON.stringify(updatedProfiles));
        form.resetFields();
    };

    const handleSelectProfile = (key: string) => {
        setSelectedProfileKey(key);
        localStorage.setItem(constants.localStorageKey.selectedProfileKey, key);
        showNotification(key);
    };

    const handleDeleteProfile = (key: string) => {
        const updatedProfiles = profiles.filter(profile => profile.key !== key);
        setProfiles(updatedProfiles);
        localStorage.setItem(constants.localStorageKey.awsProfiles, JSON.stringify(updatedProfiles));
        if (selectedProfileKey === key) {
            setSelectedProfileKey(null);
            localStorage.removeItem(constants.localStorageKey.selectedProfileKey);
        }
    };

    const handleDeleteAllProfiles = () => {
        setProfiles([]);
        localStorage.removeItem(constants.localStorageKey.awsProfiles);
        setSelectedProfileKey(null);
        localStorage.removeItem(constants.localStorageKey.selectedProfileKey);
    };

    const showNotification = (key: string) => {
        const profile = profiles.find(profile => profile.key === key);
        if (profile) {
            notification.success({
                message: 'Profile Selected',
                description: `Selected profile with AWS Access Key ID: ${profile.aws_access_key_id}`,
            });
        }
    };

    const columns = [
        {
            title: 'AWS Access Key ID',
            dataIndex: 'aws_access_key_id',
            key: 'aws_access_key_id',
        },
        {
            title: 'AWS Secret Access Key',
            key: 'aws_secret_access_key',
            render: (_: unknown, record: AwsProfile) => (
                <div>
                    {visibleSecretKey === record.key ? record.aws_secret_access_key : '********'}
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => setVisibleSecretKey(visibleSecretKey === record.key ? null : record.key)}
                    />
                </div>
            ),
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
        },
        {
            title: 'Select',
            key: 'select',
            render: (_: unknown, record: AwsProfile) => (
                <Radio
                    checked={record.key === selectedProfileKey}
                    onChange={() => handleSelectProfile(record.key)}
                />
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_: unknown, record: AwsProfile) => (
                <Popconfirm
                    title="Are you sure to delete this profile?"
                    onConfirm={() => handleDeleteProfile(record.key)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Form form={form} onFinish={handleAddProfile} layout="inline">
                <Form.Item name="aws_access_key_id" rules={[{ required: true, message: 'AWS Access Key ID is required' }]}>
                    <Input placeholder="AWS Access Key ID" />
                </Form.Item>
                <Form.Item name="aws_secret_access_key" rules={[{ required: true, message: 'AWS Secret Access Key is required' }]}>
                    <Input placeholder="AWS Secret Access Key" />
                </Form.Item>
                <Form.Item name="region" rules={[{ required: true, message: 'Region is required' }]}>
                    <Select placeholder="Select Region">
                        {constants.aws.regions.map((region) => (
                            <Select.Option key={region} value={region}>
                                {region}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        Add Profile
                    </Button>
                </Form.Item>
            </Form>
            <Divider />
            <Popconfirm
                title={`Are you sure to delete all ${profiles.length} profiles?`}
                onConfirm={handleDeleteAllProfiles}
                okText="Yes"
                cancelText="No"
            >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                    Delete all {profiles.length} profiles
                </Button>
            </Popconfirm>
            <Divider />
            <Table dataSource={profiles} columns={columns} rowKey="key" />
        </div>
    );
};

export default SettingsPage;