import { Button, Card, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UserDataType } from '../chat-page';

type FormType = {
    username: string;
};

const { Item } = Form;

type SignUpChatProps = {
    registerUser: () => void;
    userData?: UserDataType,
    setUserData: React.Dispatch<React.SetStateAction<UserDataType>>;
};

const SignUpChat = ({
    registerUser,
    setUserData,
}: SignUpChatProps) => {
    const [form] = useForm<FormType>();

    const onFinish = (values: FormType) => {
        message.info(`Welcome to The TriBook! ${values.username}`);
        setUserData(prev => ({
            ...prev,
            username: values.username,
        }))
        registerUser();
    };

    const onFinishFailed = () => {
        // message.error('Failed to sign up');
    };
    return (
        <Card title={<div style={{ textAlign: 'center' }}>Sign up to Chat</div>}>
            <Form<FormType>
                form={form}
                name='signup-chat-form'
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    message: '',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
            >
                <Item<FormType>
                    label='Username'
                    name='username'
                    rules={[{ required: true, message: 'Please input your username' }]}
                >
                    <Input type='text' placeholder='Username...' />
                </Item>
                <Item>
                    <Button type='primary' htmlType='submit' style={{
                        width: '100%',
                    }}>Go Chat</Button>
                </Item>
            </Form>
        </Card>
    );
};

export default SignUpChat;