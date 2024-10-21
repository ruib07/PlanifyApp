const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const find = (filter = {}) => app.db('Users').where(filter).first();

  const getPasswordHash = (pass) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pass, salt);
  };

  const validatePassword = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const isLengthValid = password.length >= 9;

    return hasLowercase && hasUppercase && hasDigit && hasSpecialChar && isLengthValid;
  };

  const save = async (registerUser) => {
    if (!registerUser.Name) throw new ValidationError('Name is required!');
    if (!registerUser.Email) throw new ValidationError('Email is required!');
    if (!registerUser.Password) throw new ValidationError('Password is required!');

    if (!validatePassword(registerUser.Password)) {
      throw new ValidationError('Password does not meet the requirements!');
    }

    const registerUserEmail = await find({ Email: registerUser.Email });
    if (registerUserEmail) throw new ValidationError('Email already exists!');

    const newUser = { ...registerUser };
    newUser.Password = getPasswordHash(registerUser.Password);

    return app.db('Users').insert(newUser, '*');
  };

  const confirmEmail = async (Email) => {
    const user = await find({ Email });

    if (!user) return { error: 'Email not found!' };

    if (user.confirmed) return { error: 'Email already confirmed!' };

    return { success: true };
  };

  const updatePassword = async (Email, newPassword, confirmNewPassword) => {
    try {
      if (!validatePassword(newPassword)) throw new ValidationError('Password does not meet the requirements!');

      const user = await app.services.user.find({ Email });

      if (!user) return { error: 'User not found!' };

      if (newPassword !== confirmNewPassword) return { error: 'Password must be equal in both fields!' };

      await app.db('Users').where({ Email }).update({ Password: getPasswordHash(newPassword) });

      return { success: true };
    } catch (error) {
      if (error instanceof ValidationError) return { error: error.message };

      return { error: 'Error!' };
    }
  };

  return {
    find,
    save,
    confirmEmail,
    updatePassword,
  };
};
