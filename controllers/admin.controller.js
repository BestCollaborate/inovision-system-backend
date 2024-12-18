import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response.utils.js';
import { adminService } from '../services/admin.service.js';


export const adminController = {
  createAdmin: async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASS;
    const role = process.env.ADMIN_ROLE;
    const username = process.env.ADMIN_USERNAME
    try {
      const adminRecord = await adminService.createAdmin({
        email,
        password,
        role,
        username
      });
      console.log('管理者が正常に作成されました。', adminRecord.email);
    } catch (error) {
      console.error('管理者はすでに存在します:');
    }
  },
  getTeachers: async () => {
    try {
      const teachers = await adminService.getTeachers();
      console.log('teachers', teachers);
      res.status(StatusCodes.OK).json(
        createResponse(true, "", teachers)
      );
    } catch (error) {
      console.error('error get teachers', error);
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, '管理者が取得できませんでした。', null, error.message)
      );
    }
  }
}