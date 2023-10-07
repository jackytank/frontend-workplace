import {
  Button,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  TablePaginationConfig,
} from 'antd';
import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';

const DebounceSearchUser = () => {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [options, setOptions] = useState<IEmployeeSearchAdvanced[]>([]);

  const handleSelectEmployeeOnChange = (e: number[]) => {};

  const debouncedHandleSelectOnSearch = (e: string) => {};

  return (
    <>
      <Select
        style={{ flex: 1, marginRight: '5px' }}
        placeholder={`Search user...`}
        showSearch
        filterOption={false}
        mode="multiple"
        optionLabelProp="label"
        onDeselect={removeFromActionEmployee}
        onChange={(e: number[]) => handleSelectEmployeeOnChange(e)}
        onSearch={(e: string) => debouncedHandleSelectOnSearch(e)}
        value={selectedEmployeeIds}
        notFoundContent={
          isLoading ? (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          ) : null
        }
      ></Select>
    </>
  );
};

export default DebounceSearchUser;
