import * as bcrypt from 'bcrypt';

export const comparePassword = async (
  password: string | Buffer,
  encryptedPassword: string,
) => {
  return await bcrypt.compare(password, encryptedPassword);
};
