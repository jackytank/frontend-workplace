import { Button, Card, Modal, Table } from "antd";
import { EmployeeModelApi, EmployeeReturnCols } from "./EmployeeReturnCols";
import { RootState, useAppDispatch, useAppSelector } from "../../Store";
import { useEffect, useState } from "react";
import { deleteEmployee, getEmployeeList } from "../../features/employee/EmployeeSlice";
import { employeeApi } from "../../api/EmployeeApi";
import { toastError, toastInfo } from "../../utils/toastify";
import { TableRowSelection } from "antd/es/table/interface";

const EmployeeList = () => {
  const dispatch = useAppDispatch();
  const { employeeList } = useAppSelector((store: RootState) => store.employee);
  const { isLoading } = useAppSelector((store: RootState) => store.common);
  const dataSource = employeeList.map((e) => ({ ...e, key: e.id }));
  const [selectedRows, setSelectedRows] = useState<EmployeeModelApi[]>([]);

  const handleRowSelectionChange = (selectedRows: EmployeeModelApi[]) => {
    setSelectedRows(selectedRows);
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: "Are you sure to delete these employees?",
      content: `You have seleteced ${selectedRows.length} employees to bulk delete`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const selectedIds = selectedRows.map((e) => e.id);
        const promises = selectedIds.map((id) => {
          employeeApi.removeOne(id).then(() => {
            // Update selectedRows, store after each successful deletion
            void dispatch(deleteEmployee(id));
            setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((e) => e.id !== id));
          }).catch((err) => {
            setSelectedRows([]);
            toastError(`Delete employee id: ${id} failed!`);
            throw err;
          });
        });
        Promise.all(promises).then(() => {
          toastInfo("Bulk delete employees successfully!");
        }).catch(() => {
          toastError("Bulk delete employees failed!");
        }).finally(() => {
          setSelectedRows([]);
        });
      }
    });
  };


  useEffect(() => {
    void dispatch(getEmployeeList());
  }, [dispatch]);

  const rowSelection: TableRowSelection<EmployeeModelApi> = {
    selectedRowKeys: selectedRows.map((e) => e.id),
    onChange: (_selectedRowKeys, selectedRows) => {
      handleRowSelectionChange(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
    }),
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  };

  const footer = () => (
    <Button
      type="primary"
      danger
      onClick={handleBulkDelete}
      disabled={selectedRows.length === 0 || isLoading}
    >
      Bulk delete
    </Button>
  );

  return (
    <>
      <Card title="Employee List">
        <Table
          rowSelection={rowSelection}
          columns={EmployeeReturnCols()}
          dataSource={dataSource}
          scroll={{ y: 350 }}
          footer={footer}
        />
      </Card>
    </>
  );
};

export default EmployeeList;