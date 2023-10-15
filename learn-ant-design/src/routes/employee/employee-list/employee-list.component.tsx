import { Card, Space } from "antd";
import SearchAdvanceStyle1 from "./search-advanced-style-1.component";
import SearchAdvanceStyle2 from "./search-advanced-style-2.component";

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