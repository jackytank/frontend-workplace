export interface EmployeeModelApi {
    id: number;
    hccId: string;
    name: string;
    email: string;
    ldap: string;
    legalEntityHireDate: string;
    status: EmployeeStatus;
    created: string;
    createdBy: string;
    updated: string | null;
    updatedBy: string | null;
}

export enum EmployeeStatus {
    Deactivated = 0,
    Active = 1,
    Probation = 2,
}

export const EmployeeStatusColorMap: Record<EmployeeStatus, string> = {
    [EmployeeStatus.Deactivated]: 'red',
    [EmployeeStatus.Active]: 'green',
    [EmployeeStatus.Probation]: 'yellow',
};

export interface EmployeeSearchFormType {
    search: string | null,
    name: string | null,
    email: string | null,
    status: number | null,
}