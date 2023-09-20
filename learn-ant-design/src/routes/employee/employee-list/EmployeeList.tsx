import { Card, Space } from "antd";
import SearchAdvanceStyle1 from "./SearchAdvanceStyle1";
import SearchAdvanceStyle2 from "./SearchAdvanceStyle2";

const EmployeeList = () => {
  return (
    <>
      <Card title="Employee List">
        <Space>
          <SearchAdvanceStyle1 />
          <SearchAdvanceStyle2 />
        </Space>
      </Card>
    </>
  );
};

export default EmployeeList;