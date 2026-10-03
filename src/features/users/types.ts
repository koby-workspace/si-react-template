export type YN = "Y" | "N";

export type User = {
  id: string;
  name: string;
  email: string;
  department: string;
  activeYn: YN;
};

export type UserFormValues = {
  name: string;
  email: string;
  department: string;
  activeYn: YN;
};

export type UserListQuery = {
  name: string;
  activeYn: "" | YN;
  page: number;
  pageSize: number;
};

export type UserListResult = {
  items: User[];
  total: number;
};
