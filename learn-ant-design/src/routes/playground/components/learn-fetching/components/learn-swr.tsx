import useSWR, { Fetcher, Middleware } from "swr";
import { Config } from "../../../../../Config";
import { CalendarOutlined, EnvironmentOutlined, LoadingOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Spin } from "antd";
import { User } from "../../../../../Main.Types";
import { concatDomain, logger } from "../../../../../api/SwrMiddleware";

const fetcher: Fetcher<User[], string> = (url) => {
    return fetch(url).then(res => res.json());
};

const LearnSWR = () => {
    const { data, error, isLoading } = useSWR<User[], Error>(
        Config.API_PATH.USER,
        fetcher,
        { use: [concatDomain, logger] as Middleware[] }
    );

    if (error) return "Error had occur!";
    if (isLoading) return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;

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