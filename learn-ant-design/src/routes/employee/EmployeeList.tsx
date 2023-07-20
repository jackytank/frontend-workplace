import { Spin, Table } from "antd";
import { EmployeeReturnCols } from "./EmployeeReturnCols";
import { RootState, useAppDispatch, useAppSelector } from "../../Store";
import { useEffect, useMemo } from "react";
import { getEmployeeList } from "../../features/employee/EmployeeSlice";

const EmployeeList = () => {
  const { employeeList, isLoading } = useAppSelector((store: RootState) => store.employee);
  const dispatch = useAppDispatch();

  const dataSource = useMemo(() => employeeList.map((e) => ({ ...e, key: e.id })), [employeeList]);

  useEffect(() => {
    if (!employeeList.length) {
      void dispatch(getEmployeeList());
    }
  }, [dispatch, employeeList]);

  return (
    <>
      {isLoading
        ? <Spin tip="loading">
          <Table columns={EmployeeReturnCols()} dataSource={dataSource} />
        </Spin>
        : <Table columns={EmployeeReturnCols()} dataSource={dataSource} />}
    </>
  );
};

export default EmployeeList;