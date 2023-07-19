import { ColumnsType } from "antd/es/table";

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

const EmployeeReturnCols = (): ColumnsType<EmployeeModelApi> => {
  return [
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
      width: "15%"
    },
  ];
};

export { EmployeeReturnCols };