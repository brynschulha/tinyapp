const getUserByEmail = function (usersdb, email) {
  for (let user in usersdb) {
    if (usersdb[user]["email"] === email) {
      return (usersdb[user]);
    } 
  }
  return null;
};

module.exports = getUserByEmail;