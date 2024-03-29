import useSWR, { Fetcher, Middleware } from "swr";
import { Config } from "../../../../../config";
import { CalendarOutlined, EnvironmentOutlined, LoadingOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Spin } from "antd";
import { User } from "../../../../../main.type";
import { concatDomain, logger } from "../../../../../api/swr-middlewares";
import _ from 'lodash';

const fetcher: Fetcher<User[], string> = (url) => {
    return fetch(url).then(res => res.json());
};

const LearnSWR = () => {
    const { data, error, isLoading } = useSWR<User[], Error>(
        Config.API_PATH.USER,
        fetcher,
        { use: [concatDomain, logger] as Middleware[] }
    );
    const loading = _.debounce(() => isLoading, 2000);

    if (error) return "Error had occur!";
    if (loading()) return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;

    return (
        <>
            <div>
                <Row gutter={[24, 24]}>
                    {data?.map((user) => (
                        <Col span={6} key={user.id}>
                            <Card title={user.name}>
                                <p>
                                    <UserOutlined /> {user.name}
                                </p>
                                <p>
                                    <MailOutlined /> {user.email}
                                </p>
                                <p>
                                    <CalendarOutlined /> {user.age} years old
                                </p>
                                <p>
                                    <EnvironmentOutlined /> {user.city}
                                </p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};

export default LearnSWR;
