import { ColumnType } from "ant-design-vue/es/table";
import { UserType } from "../../../types/global";

export const userTableColumns: ColumnType<UserType>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
    }
];