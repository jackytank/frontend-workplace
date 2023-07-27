import { Card, Spin, Table } from "antd";
import { EmployeeReturnCols } from "./EmployeeReturnCols";
import { RootState, useAppDispatch, useAppSelector } from "../../Store";
import { useEffect, useMemo } from "react";
import { getEmployeeList } from "../../features/employee/EmployeeSlice";

const EmployeeList = () => {
  const { employeeList } = useAppSelector((store: RootState) => store.employee);
  const dispatch = useAppDispatch();

  const dataSource = useMemo(() => employeeList.map((e) => ({ ...e, key: e.id })), [employeeList]);

  useEffect(() => {
    if (!employeeList.length) {
      void dispatch(getEmployeeList());
    }
  }, [dispatch, employeeList]);

  return (
    <>
      <Card title="Employee List">
        <Table
          columns={EmployeeReturnCols()}
          dataSource={dataSource}
          scroll={{ y: 250 }} />
      </Card>
    </>
  );
};

export default EmployeeList;