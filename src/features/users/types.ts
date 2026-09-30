export type YN = "Y" | "N";

export type User = {
  id: string;
  name: string;
  email: string;
  department: string;
  activeYn: YN;
};
