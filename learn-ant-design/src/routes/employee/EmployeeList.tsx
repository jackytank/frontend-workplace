import { Table } from "antd";
import { EmployeeReturnCols } from "./EmployeeReturnCols";
import { useAppDispatch } from "../../Store";

const EmployeeList = () => {
  const dispatch = useAppDispatch()

  return (
    <>
      <Table columns={EmployeeReturnCols()} />
    </>
  );
};

export default EmployeeList;