import { useState } from "react";
import { Select, Modal } from "antd";
import CustomTable from "./CustomTable";

const { Option } = Select;

const options = [
    { value: "emp1", label: "Employee 1" },
    { value: "emp2", label: "Employee 2" },
    { value: "emp3", label: "Employee 3" },
];

const PlayGround = () => {
    const [selected, setSelected] = useState<string[]>([]);

    const handleChange = (value: string[]) => {
        // get the last selected option
        const last = value[value.length - 1];
        // check if it is already in the selected array
        if (selected.includes(last)) {
            // if yes, do nothing
            return;
        }
        if (!selected.includes(last) && last !== undefined) {
            // if no, store it in a temporary variable and show the confirm modal
            const temp = last;
            Modal.confirm({
                title: `Do you want to select ${last}?`,
                width: '60%',
                content: (
                    <CustomTable />
                ),
                onOk() {
                    console.log("OK");
                    // update the selected state with the temporary variable
                    setSelected([...selected, temp]);
                },
                onCancel() {
                    // remove the last option from the value array when canceled
                    value.pop();
                },
            });
        }
    };

    const handleDeselect = (value: string) => {
        // remove the deselected option from the selected state
        setSelected(selected.filter((item) => item !== value));
    };

    return (
        <Select
            mode="multiple"
            style={{ width: 1000 }}
            placeholder="Please select"
            onChange={handleChange}
            onDeselect={handleDeselect} // add this prop
            value={selected}
        >
            {options.map((option) => (
                <Option
                    key={option.value}
                    value={option.value}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {option.label}
                        {option.value === 'emp2' ? <span style={{ color: "grey" }}> Working on another project</span> : ''}
                    </div>
                </Option>
            ))}
        </Select>
    );

};

export default PlayGround;