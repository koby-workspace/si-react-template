export const actionLabels = {
  CREATE: "등록",
  UPDATE: "수정",
  DELETE: "삭제",
};

export const actionOptions = Object.entries(actionLabels).map(([value, label]) => ({
  value,
  label,
}));

export const fieldLabels = {
  loginId: "아이디",
  name: "이름",
  email: "이메일",
  groupId: "사용자 그룹",
  status: "상태",
};
