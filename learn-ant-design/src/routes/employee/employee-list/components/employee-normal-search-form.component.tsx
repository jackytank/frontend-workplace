import { ClearOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import { useState } from "react";
import debounce from "lodash/debounce";
import { useAppDispatch } from "../../../../store";
import { setSelectedEmployeeList, getEmployeeList } from "../../../../features/employee/employee-slice";
import { EmployeeSearchFormType } from "../../employee.type";

const EmployeeNormalSearchForm = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [searchValues, setSearchValues] = useState<EmployeeSearchFormType>({ search: '', name: '', email: '', status: 0 });

    const handleClearButton = () => {
        form.resetFields();
        // void dispatch(getEmployeeList({
        //     search: null,
        //     name: null,
        //     email: null,
        //     status: null
        // }));
        dispatch(setSelectedEmployeeList([]));
    };

    const debouncedSearch = debounce((object: EmployeeSearchFormType) => {
        void dispatch(getEmployeeList(object));
    }, 850);

    const handleSearchChange = () => {
        debouncedSearch(searchValues);
    };

    const getFields = () => {
        return (
            <>
                <Col span={24}>
                    <Form.Item name="search" label="Search">
                        <Input placeholder="Type to search..." onChange={handleSearchChange}
                        />
                    </Form.Item>
                </Col>
                {/* {expand && <>
                    <Col span={8}>
                        <Form.Item name="name" label="Name">
                            <Input placeholder="Name" onChange={handleSearchChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="email" label="Email">
                            <Input placeholder="Email" onChange={handleSearchChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label="Status">
                            <Select placeholder="Status" onChange={handleSearchChange}>
                                <Select.Option value="Active">Active</Select.Option>
                                <Select.Option value="Inactive">Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </>} */}
            </>
        );
    };

    return (
        <>
            <Card style={{ marginBottom: '15px' }} title="Normal Search">
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onValuesChange={(_changedValues, allValues: EmployeeSearchFormType) => setSearchValues(allValues)}
                >
                    <Row gutter={24}>{getFields()}</Row>
                    <div style={{ textAlign: 'right' }}>
                        <Space size="small">
                            <Button onClick={handleClearButton} icon={<ClearOutlined />}>
                                Reset
                            </Button>
                            {/* <a style={{ fontSize: 12 }} onClick={handleExpandButton}>
                                <DownOutlined rotate={expand ? 180 : 0} /> {expand ? 'Collapse' : 'Expand'}
                            </a> */}
                        </Space>
                    </div>
                </Form>
            </Card>
        </>
    );
};

export default EmployeeNormalSearchForm;