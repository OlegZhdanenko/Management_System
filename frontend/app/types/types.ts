export type Note = {
  id: string;
  title: string;
  content: string;
  groupId: string;
  createdBy: string;
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ROOT_ADMIN" | "ADMIN" | "USER";
  notes?: Note[];
};

export type Group = {
  id: string;
  name: string;
  createdBy: string;
  creator?: User;
  notes?: Note[];
  users?: User[];
};
