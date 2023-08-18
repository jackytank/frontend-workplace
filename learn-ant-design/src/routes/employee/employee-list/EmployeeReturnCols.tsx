import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Popconfirm, Select, Tag } from "antd";
import { EmployeeModelApi, EmployeeStatus, EmployeeStatusColorMap } from "../Employee.Types";
import { RootState, store, useAppSelector } from "../../../Store";
import { employeeApi } from "../../../api/EmployeeApi";
import { deleteEmployee } from "../../../features/employee/EmployeeSlice";
import { toastInfo } from "../../../utils/toastify";
import { CloseOutlined } from "@ant-design/icons";

export const EmployeeReturnCols = (): ColumnsType<EmployeeModelApi> => {
  const { isLoading } = useAppSelector((store: RootState) => store.common);

  const handleStatusOnChange = () => {
    console.log("handleStatusOnChange");
  };

  return [
    {
      title: "ID",
      dataIndex: 'id',
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
          // <Tag color={statusColor}>
          //   {statusText}
          // </Tag>
          <Select
            defaultValue="lucy"
            onChange={handleStatusOnChange}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'Yiminghe', label: 'yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true },
            ]}
          />
        );
      }
    },
    {
      key: "deleteEmployee",
      width: "15%",
      render: (record: EmployeeModelApi) => (
        <Popconfirm
          title="Confirm"
          description="Are you sure to delete this employee?"
          okButtonProps={{ loading: isLoading }}
          onConfirm={() => {
            void employeeApi.removeOne(record.id).then((res) => {
              if (res.status === 200) {
                store.dispatch(deleteEmployee(record.id));
                toastInfo("Delete employee successfully!");
              }
            });
          }}
          onCancel={() => {
            toastInfo("Cancel delete employee!");
          }}
        >
          <Button type="dashed" danger>
            <CloseOutlined />Delete
            </Button>
        </Popconfirm>
      )
    },
  ];
};
