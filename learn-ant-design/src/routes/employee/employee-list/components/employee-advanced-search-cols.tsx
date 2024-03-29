import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Tag } from "antd";
import { EmployeeModelApi, EmployeeStatus, EmployeeStatusColorMap } from "../../employee.type";

export const EmployeeAdvanceSearchReturnCols = (): ColumnsType<EmployeeModelApi> => {
    return [
        {
            title: "ID",
            dataIndex: 'uniqueKey',
            width: "6%"
        },
        {
            title: "HCCID",
            dataIndex: 'hccId',
        },
        {
            title: "LDAP",
            dataIndex: 'ldap',
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a: EmployeeModelApi, b: EmployeeModelApi) => a.name.length - b.name.length,
            width: "15%"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "10%"
        },
        {
            title: "Legal Entity Hire Date",
            dataIndex: "legalEntityHireDate",
            key: "legalEntityHireDate",
            width: "15%",
            render: (value: string) => {
                return dayjs(value).format("DD-MM-YYYY");
            },
        },
        {
            title: "Status",
            width: "10%",
            dataIndex: 'status',
            render: (value: EmployeeStatus) => {
                const statusText = EmployeeStatus[value];
                const statusColor = EmployeeStatusColorMap[value];
                return (
                    <Tag color={statusColor}>
                        {statusText}
                    </Tag>
                    // <Select
                    //   defaultValue="lucy"
                    //   onChange={handleStatusOnChange}
                    //   options={[
                    //     { value: 'jack', label: 'Jack' },
                    //     { value: 'lucy', label: 'Lucy' },
                    //     { value: 'Yiminghe', label: 'yiminghe' },
                    //     { value: 'disabled', label: 'Disabled', disabled: true },
                    //   ]}
                    // />
                );
            }
        },
        // {
        //     key: "deleteEmployee",
        //     width: "15%",
        //     render: (record: EmployeeModelApi) => (
        //         <Popconfirm
        //             title="Confirm"
        //             description="Are you sure to delete this employee?"
        //             okButtonProps={{ loading: isLoading }}
        //             onConfirm={() => {
        //                 void employeeApi.removeOne(record.id).then((res) => {
        //                     if (res.status === 200) {
        //                         store.dispatch(deleteEmployee(record.id));
        //                         toastInfo("Delete employee successfully!");
        //                     }
        //                 });
        //             }}
        //             onCancel={() => {
        //                 toastInfo("Cancel delete employee!");
        //             }}
        //         >
        //             <Button type="dashed" danger>
        //                 <CloseOutlined />Delete
        //             </Button>
        //         </Popconfirm>
        //     )
        // },
    ];
};
