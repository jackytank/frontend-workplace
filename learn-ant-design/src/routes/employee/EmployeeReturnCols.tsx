import { Button, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { RootState, store } from "../../Store";
import { useSelector } from "react-redux";
import { toastInfo } from "../../utils/toastify";
import { employeeApi } from "../../api/EmployeeApi";
import { deleteEmployee } from "../../features/employee/EmployeeSlice";

export interface EmployeeModelApi {
  id: number;
  created: string;
  createdBy: string;
  updated: string | null;
  updatedBy: string | null;
  email: string;
  hccId: string;
  ldap: string;
  legalEntityHireDate: string;
  name: string;
}

export const EmployeeReturnCols = (): ColumnsType<EmployeeModelApi> => {
  const { isLoading } = useSelector((store: RootState) => store.common);
  return [
    {
      title: "ID",
      dataIndex: 'id',
      width: "5%"
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
      title: "",
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
          <Button type="primary">Delete</Button>
        </Popconfirm>
      )
    },
  ];
};
