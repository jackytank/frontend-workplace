import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Modal, Table, Button, Space } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useState } from "react";
import { useAppDispatch, useAppSelector, RootState } from "../../../store";
import { employeeApi } from "../../../api/employee-api";
import { setRemoveEmployeeList, setSelectedEmployeeList } from "../../../features/employee/employee-slice";
import { toastError, toastInfo } from "../../../utils/toastify";
import { EmployeeModelApi } from "../employee.type";
import EmployeeAdvanceSearch from "./components/employee-advanced-search.component";
import { EmployeeAdvanceSearchReturnCols } from "./components/employee-advanced-search-cols";
import EmployeeNormalSearchForm from "./components/employee-normal-search-form.component";
import { EmployeeSearchNormalReturnCols } from "./components/employee-normal-search-cols";

const SearchAdvanceStyle1 = () => {
    const dispatch = useAppDispatch();
    const { employeeList, selectedEmployeeList } = useAppSelector((store: RootState) => store.employee);
    const { isLoading } = useAppSelector((store: RootState) => store.common);
    const modifiedEmployeeList = employeeList.map((e) => ({ ...e, key: e.uniqueKey }));
    const modifiedSelectedEmployeeList = selectedEmployeeList.map((e) => ({ ...e, key: e.uniqueKey }));
    const [showAdvance, setShowAdvance] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [selectedSearchNormalRows, setSelectedSearchNormalRows] = useState<EmployeeModelApi[]>([]);
    const [selectedSearchAdvanceRows, setSelectedSearchAdvanceRows] = useState<EmployeeModelApi[]>([]);

    const handleSearchNormalRowSelectionChange = (selectedRows: EmployeeModelApi[]) => {
        setSelectedSearchNormalRows(selectedRows);
    };
    const handleSearchAdvanceRowSelectionChange = (selectedRows: EmployeeModelApi[]) => {
        setSelectedSearchAdvanceRows(selectedRows);
    };

    const handleBulkDelete = () => {
        Modal.confirm({
            title: "Are you sure to delete these employees?",
            content: `You have seleteced ${selectedSearchNormalRows.length} employee${selectedSearchNormalRows.length > 1 ? 's' : ''} to bulk delete`,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                const selectedIds = selectedSearchNormalRows.map((e) => e.id);
                const promises = selectedIds.map((id) => {
                    employeeApi.removeOne(id).then((res) => {
                        // Update selectedRows, store after each successful deletion
                        dispatch(setRemoveEmployeeList(res.data as EmployeeModelApi));
                        setSelectedSearchNormalRows((prevSelectedRows) => prevSelectedRows.filter((e) => e.id !== id));
                    }).catch((err) => {
                        setSelectedSearchNormalRows([]);
                        toastError(`Delete employee id: ${id} failed!`);
                        throw err;
                    });
                });
                Promise.all(promises).then(() => {
                    toastInfo("Bulk delete employees successfully!");
                }).catch(() => {
                    toastError("Bulk delete employees failed!");
                }).finally(() => {
                    setSelectedSearchNormalRows([]);
                });
            }
        });
    };

    // useEffect(() => {
    //   void dispatch(getEmployeeList({
    //     search: null,
    //     name: null,
    //     email: null,
    //     status: null
    //   }));
    // }, [dispatch]);

    const rowSelectionSearchNormal: TableRowSelection<EmployeeModelApi> = {
        selectedRowKeys: selectedSearchNormalRows.map((e) => e.uniqueKey.toString()),
        onChange: (_selectedRowKeys, selectedRows) => {
            handleSearchNormalRowSelectionChange(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
        }),
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
    };
    const rowSelectionSearchAdvance: TableRowSelection<EmployeeModelApi> = {
        selectedRowKeys: selectedSearchAdvanceRows.map((e) => e.uniqueKey.toString()),
        onChange: (_selectedRowKeys, selectedRows) => {
            handleSearchAdvanceRowSelectionChange(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
        }),
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
    };

    const handleSearchAdvanceButton = (newState: boolean) => {
        setShowAdvance(newState);
        setShowListModal(!showListModal);
    };

    const handleMoveToNormalSearchButton = () => {
        dispatch(setSelectedEmployeeList([
            ...selectedEmployeeList,
            ...selectedSearchAdvanceRows
        ]));
        setSelectedSearchAdvanceRows([]);
        handleSearchAdvanceButton(false);
    };

    const footerSearchNormal = () => (
        <Button
            type="primary"
            danger
            onClick={handleBulkDelete}
            disabled={selectedSearchNormalRows.length === 0 || isLoading}
        >
            Bulk delete
        </Button>
    );

    const footerSearchAdvance = () => (
        <Button
            type="dashed"
            onClick={handleMoveToNormalSearchButton}
            disabled={selectedSearchAdvanceRows.length === 0 || isLoading}
        >
            {selectedSearchAdvanceRows.length === 0
                ? 'Please select to move to normal search'
                : <><LeftOutlined /> Move {selectedSearchAdvanceRows.length} selected to normal search</>
            }
        </Button>
    );
    return (
        <>
            <Modal
                open={!showAdvance && showListModal}
                onOk={() => setShowListModal(false)}
                onCancel={() => setShowListModal(false)}
                width={1200}
            >
                <EmployeeNormalSearchForm />
                <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <a style={{ fontSize: 12 }} onClick={() => handleSearchAdvanceButton(true)}>
                        {/* <RightOutlined rotate={showAdvance ? 180 : 0} /> {showAdvance ? 'Collapse Search Advance' : 'Show Search Advance'} */}
                        <RightOutlined /> Show Search Advance
                    </a>
                </Space>
                <Table
                    rowKey={(e) => e.uniqueKey.toString()}
                    rowSelection={rowSelectionSearchNormal}
                    columns={EmployeeSearchNormalReturnCols()}
                    dataSource={modifiedSelectedEmployeeList}
                    scroll={{ y: 350 }}
                    footer={footerSearchNormal}
                />
            </Modal>

            <Modal
                open={showAdvance && !showListModal}
                onOk={() => setShowAdvance(false)}
                onCancel={() => setShowAdvance(false)}
                width={1200}
            >
                <EmployeeAdvanceSearch />
                <Space style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <a style={{ fontSize: 12 }} onClick={() => handleSearchAdvanceButton(false)}>
                        <LeftOutlined /> Show Normal Search
                    </a>
                </Space>
                <Table
                    rowKey={(e) => e.uniqueKey.toString()}
                    rowSelection={rowSelectionSearchAdvance}
                    columns={EmployeeAdvanceSearchReturnCols()}
                    dataSource={modifiedEmployeeList}
                    scroll={{ y: 350 }}
                    footer={footerSearchAdvance}
                />
            </Modal>

            <Button onClick={() => setShowListModal(true)}>Search Advance Style 1</Button>
        </>
    );
};

export default SearchAdvanceStyle1;