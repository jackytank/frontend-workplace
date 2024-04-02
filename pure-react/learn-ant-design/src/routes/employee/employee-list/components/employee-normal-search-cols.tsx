import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Popconfirm, Space, Tag } from "antd";
import { ArrowDownOutlined, CloseOutlined, CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector, RootState, store } from "../../../../store";
import { employeeApi } from "../../../../api/employee-api";
import { setRemoveSelectedEmployeeList, setSelectedEmployeeList, setRemoveEmployeeList } from "../../../../features/employee/employee-slice";
import { toastInfo } from "../../../../utils/toastify";
import { EmployeeModelApi, EmployeeStatus, EmployeeStatusColorMap } from "../../employee.type";

export const EmployeeSearchNormalReturnCols = (): ColumnsType<EmployeeModelApi> => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((store: RootState) => store.common);
  const { selectedEmployeeList } = useAppSelector((store: RootState) => store.employee);
  const handleRemoveRow = (record: EmployeeModelApi) => {
    dispatch(setRemoveSelectedEmployeeList(record));
  };
  const handleCloneRow = (record: EmployeeModelApi) => {
    const clonedList = [...selectedEmployeeList];
    const idx = selectedEmployeeList.findIndex(e => e.uniqueKey === record.uniqueKey);
    if (idx !== -1) {
      const updatedList = [
        ...clonedList.slice(0, idx + 1),
        record,
        ...clonedList.slice(idx + 1)
      ];
      dispatch(setSelectedEmployeeList(updatedList));
    }
  };

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
    {
      key: "operations",
      width: "15%",
      render: (record: EmployeeModelApi) => (
        <>
          <Space>
            <Popconfirm
              title="Confirm"
              description="Are you sure to delete this employee?"
              okButtonProps={{ loading: isLoading }}
              onConfirm={() => {
                void employeeApi.removeOne(record.id).then((res) => {
                  if (res.status === 200) {
                    store.dispatch(setRemoveEmployeeList(record));
                    toastInfo("Delete employee successfully!");
                  }
                });
              }}
              onCancel={() => {
                toastInfo("Cancel delete employee!");
              }}
            >
              <Button type="dashed" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
            <Button type="dashed" onClick={() => handleRemoveRow(record)}>
              <CloseOutlined />
            </Button>
            <Button type="dashed" onClick={() => handleCloneRow(record)}>
              <CopyOutlined />
              <ArrowDownOutlined />
            </Button>

          </Space>
        </>
      )
    },
  ];
};
