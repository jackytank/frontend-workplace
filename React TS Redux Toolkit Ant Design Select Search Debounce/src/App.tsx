import './App.css';
import { Space, Select, message, Modal, Button } from "antd";
import { useState, useEffect, cloneElement } from "react";
import { User, } from "./types";

export default function App() {
  const [selected, setSelected] = useState<number[]>([]);
  const [options, setOptions] = useState<User[]>([]);
  const [modal, modalContextHolder] = Modal.useModal();
  const [modalXButton, modalXButtonContextHolder] = Modal.useModal();

  const onChange = (records: number[]) => {
    // get the last selected option
    const last = records[records.length - 1];
    // check if it is already in the selected array
    if (selected.includes(last)) {
      // if yes, do nothing
      return;
    }
    if (!selected.includes(last) && last !== undefined) {
      // if no, store it in a temporary variable and show the confirm modal
      const temp = last;
      modal.confirm({
        title: `Do you want to select ${temp}?`,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk() {
          setSelected(prev => {
            const newState = [...prev, temp];
            console.log('newState', newState);
            return newState;
          });
        },
        onCancel() {
          // remove the last option from the value array when canceled
          records.pop();
        },
      });
    }
  };

  const onDeselect = (record: number) => {
    setSelected(selected.filter((item) => item !== record));
  };

  const handleXButtonClick = (record: User) => {
    const onOk = () => {
      onDeselect(record.id);
    };
    const onCancel = () => {
    };
    modalXButton.confirm({
      title: `Remove confirm`,
      content: `Do you want to remove this user (id: ${record.id})?`,
      onOk: () => onOk(),
      onCancel: () => onCancel(),
      okText: 'Yes',
      cancelText: 'Cancel',
    });
  };

  useEffect(() => {
    fetch(`https://random-data-api.com/api/v2/users?size=10`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not okay.');
        }
      })
      .then((data) => {
        console.log(data);
        setOptions(data);
      })
      .catch((error) => {
        message.error(`Error: ${error.message}`);
      });
  }, []);

  return (
    <>
      {cloneElement(modalContextHolder, { key: 'modalContextHolder' })}
      {cloneElement(modalXButtonContextHolder, { key: 'modalXButtonContextHolder' })}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Select
          style={{ width: '30rem' }}
          placeholder={`Select user...`}
          mode="multiple"
          optionLabelProp="label"
          onChange={(e) => onChange(e)}
          onDeselect={(e) => onDeselect(e)}
          value={selected}
        >
          {options.map((option: User) => {
            const isDisabled = selected.includes(option.id);
            return (
              <Select.Option
                key={option.id}
                value={option.id}
                label={<>
                  {option.last_name}
                  <Button
                    size='small'
                    type='text'
                    onClick={() => handleXButtonClick(option)}
                  >
                    x
                  </Button>
                </>}

                disabled={isDisabled}
              >
                <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span>{option.last_name}</span>
                    <span>{option.email}</span>
                  </div>
                </Space>
              </Select.Option>
            );
          })}
        </Select>
      </div>
    </>
  );
}

