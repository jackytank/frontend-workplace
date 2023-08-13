import { ClearOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import { useState } from "react";
import { useAppDispatch } from "../../../Store";
import { getEmployeeList } from "../../../features/employee/EmployeeSlice";
import debounce from "lodash/debounce";

const EmployeeSearchForm = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [expand, setExpand] = useState<boolean>(false);

    const handleClearButton = () => {
        form.resetFields();
        void dispatch(getEmployeeList());
    };

    const handleExpandButton = () => {
        setExpand(!expand);
    };

    const debouncedSearch = debounce((value) => {
        void dispatch(getEmployeeList(value as string));
    }, 850);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const queryValue = event.currentTarget.value;
        debouncedSearch(queryValue);
    };

    const getFields = () => {
        return (
            <>
                <Col span={24}>
                    <Form.Item name="Search" label="Search">
                        <Input
                            placeholder="Type to search..."
                            onChange={handleSearchChange}
                        />
                    </Form.Item>
                </Col>
                {expand && <h2>To be developed...</h2>}
            </>
        );
    };

    return (
        <>
            <Card style={{ marginBottom: '15px' }}>
                <Form form={form} layout="vertical" autoComplete="off">
                    <Row gutter={24}>{getFields()}</Row>
                    <div style={{ textAlign: 'right' }}>
                        <Space size="small">
                            <Button onClick={handleClearButton} icon={<ClearOutlined />}>
                                Reset
                            </Button>
                            <a style={{ fontSize: 12 }} onClick={handleExpandButton}>
                                <DownOutlined rotate={expand ? 180 : 0} /> Collapse
                            </a>
                        </Space>
                    </div>
                </Form>
            </Card>
        </>
    );
};

export default EmployeeSearchForm;