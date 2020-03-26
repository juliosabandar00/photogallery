const bcrypt = require('bcryptjs');

function checkPass(str, hash) {
  return bcrypt.compareSync(str, hash)
}

module.exports = checkPass