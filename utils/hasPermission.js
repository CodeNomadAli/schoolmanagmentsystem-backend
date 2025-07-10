export const hasPermission = (user, permissionKey) => {
  if (!user || !Array.isArray(user.permissions)) return false;
  return user.permissions.includes(permissionKey.toLowerCase());
};
