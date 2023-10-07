import './App.css'
import { LoadingOutlined } from "@ant-design/icons";
import { Space, Select, Spin, message } from "antd";
import axios, { AxiosError } from "axios";
import _ from "lodash";
import { useState, useMemo } from "react";
import { User, UserApiParams } from "./types";

export default function App() {
	const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
	const [options, setOptions] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const removeFromActionEmployee = (option: number) => {
		setSelectedEmployeeIds(selectedEmployeeIds.filter((item) => item !== option));
	};

	const handleSelectOnSearch = (keyword: string) => {
		console.log('keyword', keyword);
		setOptions([]);
		setIsLoading(true);
		axios.get('https://random-data-api.com/api/v2/users', {
			params: {
				size: 10
			} as UserApiParams
		}).then((res) => {
			if (Array.isArray(res)) {
				setOptions(res);
			}
		}).catch((err: AxiosError) => {
			message.error(`Error: ${err.message}`);
		}).finally(() => {
			setIsLoading(false);
		});
	};

	const debouncedHandleSelectOnSearch = useMemo(() => _.debounce(handleSelectOnSearch, 600), []);

	return (
		<>
			<Select
				placeholder={`Search user...`}
				showSearch
				filterOption={false}
				mode="multiple"
				optionLabelProp="label"
				onDeselect={removeFromActionEmployee}
				onSearch={(e: string) => debouncedHandleSelectOnSearch(e)}
				value={selectedEmployeeIds}
				notFoundContent={
					isLoading ? (
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
						/>
					) : null
				}
			>
				{!options.length
					? ''
					: options.map((option: User) => {
						return (
							<Select.Option
								key={option.id}
								value={option.id}
								label={option.last_name}
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
		</>
	);
}