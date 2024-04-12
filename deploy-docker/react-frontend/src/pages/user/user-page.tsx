/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import reactLogo from '../../assets/react.svg';
import { Button, Card, Col, Form, Image, Input, List, Result, Row, message } from 'antd';
import { json, useLoaderData, useNavigate } from 'react-router-dom';
import { useFetchUsers } from '../../hooks/useFetchUsers';

type FormType = {
  name: string;
  email: string;
};

export const loader = async () => {
  const message = 'message from loader';
  return json({ message });
};

function UserPage() {
  const loaderData = useLoaderData() as { message: string; };
  const [count, setCount] = useState(0);
  const nav = useNavigate();
  const HOST = import.meta.env.VITE_API_URL as string;
  const [form] = Form.useForm<FormType>();
  const { data: users, loading, error, refetch } = useFetchUsers(`${HOST}/users`);
  if (error) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, there are errors, no one love u :("
        extra={<Button type="primary" onClick={() => nav('/')}>Go back home & visit your family you DUMB piece of SH*T</Button>}
      />
    );
  }
  return (
    <div>
      <Card>
        <Image src={reactLogo} className="app-logo" alt="react logo" />
      </Card>
      <Card title={<h1>{loaderData.message}</h1>}>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <List
          loading={loading}
          itemLayout='horizontal'
          dataSource={users}
          renderItem={user => (
            <List.Item>
              <List.Item.Meta
                title={user.name}
                description={user.email}
              />
              <Button danger size='small' onClick={async () => {
                await fetch(`${HOST}/users/${user.id}`, {
                  method: 'DELETE',
                });
                refetch();
              }}
              >
                X
              </Button>
            </List.Item>
          )}
          footer={
            <Form<FormType> form={form} onFinish={async (values) => {
              const res = await fetch(`${HOST}/users`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              });
              if (res.status === 400) {
                const data = await res.text();
                form.setFields([{ name: 'email', errors: [data] }]);
                message.error(data);
              } else {
                refetch();
              }
            }}>
              <Row gutter={8}>
                <Col span={10}>
                  <Form.Item
                    name='name' rules={[{ required: true, message: 'Please input your name...' }]} noStyle
                  >
                    <Input type='text' placeholder='Name...' />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name='email' rules={[{ required: true, message: 'Please input your email...' }]} noStyle
                  >
                    <Input type='email' placeholder='Email...' />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item noStyle>
                    <Button type='primary' htmlType='submit'>
                      Add
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          }
        />
      </Card>
    </div>
  );
}

export default UserPage;
