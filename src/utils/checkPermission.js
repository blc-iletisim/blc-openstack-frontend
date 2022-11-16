/**
 * Checks whether authorized user has access to specific permission.
 * @param {Object} auth Authorized user data
 * @param {String} permission One of AUTH_PERMISSIONS
 */
 function checkPermission(auth, permission) {
  const user_permissions = Object.values(auth || {}) || [];
 // console.log("auth: ",auth)
// console.log("auth.permissions: ",auth.permissons);
 
 //console.log("user_permissions: ",user_permissions)
 //console.log("permissions: ",permission)
  return auth.includes(permission);
}

export default checkPermission;
