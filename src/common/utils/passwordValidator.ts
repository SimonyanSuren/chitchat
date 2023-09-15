export const validatePassword = (password: string, rePassword: string): string[] => {
  const errorMessages: string[] = [];

  if (password.length < 8)
    errorMessages.push('The password must be at least 8 characters long.');
  if (password.length > 50)
    errorMessages.push('The password must be at most 50 characters long.');
  if (!/(?=.*[0-9])/.test(password))
    errorMessages.push('The password must contain at least one number.');
  if (!/(?=.*[A-Z])/.test(password))
    errorMessages.push('The password must contain at least one uppercase letter.');
  if (!/^(?=.*[a-z])/.test(password))
    errorMessages.push('The password must contain at least one lowercase letter.');
  if (!/(?=.[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/.test(password))
    errorMessages.push('The password must contain at least one special character.');
  if (!/^\S*$/.test(password))
    errorMessages.push('The password must not contain any whitespace.');
  if (password !== rePassword) {
    errorMessages.push("The entered passwords don't match.");
  }

  return errorMessages;
};
