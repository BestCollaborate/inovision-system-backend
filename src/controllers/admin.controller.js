import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response.utils.js';
import { adminService } from '../services/admin.service.js';
import { log } from 'winston';


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
    }
  },
  getUserCount: async(req, res) => {  
    try {
      const count = await adminService.getUserCount();
      res.status(StatusCodes.OK).json(
        createResponse(true, "", count)
      );
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, '管理者が取得できませんでした。', null, error.message)
      );
    }
  },
  getTeachers: async (req, res) => {
    try {
      const teachers = await adminService.getTeachers();
      res.status(StatusCodes.OK).json(
        createResponse(true, "", teachers)
      );
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, '管理者が取得できませんでした。', null, error.message)
      );
    }
  },
  updateTeacher: async (req, res) => {
    try {
      const uid = req.params.id;
      const updateData = req.body;
      await adminService.updateTeacher({ uid, updateData });
      res.status(StatusCodes.OK).json(
        createResponse(true, "ユーザーの変更に成功しました。", null)
      );
    } catch (error) {
      console.error('error update teacher', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  deleteTeacher: async (req, res) => {
    try {
      const uid = req.params.id;
      await adminService.deleteTeacher({ uid });
      res.status(StatusCodes.OK).json(
        createResponse(true, "ユーザーの削除に成功しました。", null)
      );
    } catch (error) {
      console.error('error delete teacher', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  getParents: async (req, res) => {
    try {
      const parents = await adminService.getParents();
      res.status(StatusCodes.OK).json(
        createResponse(true, "", parents)
      );
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, '管理者が取得できませんでした。', null, error.message)
      );
    }
  },
  updateParent: async (req, res) => {
    try {
      const uid = req.params.id;
      const updateData = req.body;
      await adminService.updateParent({ uid, updateData });
      res.status(StatusCodes.OK).json(
        createResponse(true, "更新に成功しました。")
      );
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  deleteParent: async (req, res) => {
    try {
      const uid = req.params.id;
      await adminService.deleteParent({ uid });
      res.status(StatusCodes.OK).json(
        createResponse(true, "削除に成功しました。", null)
      );
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  getStudents: async (req, res) => {
    try {
      const students = await adminService.getStudents();
      res.status(StatusCodes.OK).json(
        createResponse(true, "ユーザーを取得しました。", students)
      );
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  updateStudent: async (req, res) => {
    try {
      const username = req.params.id;
      const updateData = req.body;
      const student = await adminService.updateStudent({ updateData, username });
      res.status(StatusCodes.OK).json(
        createResponse(true, "ユーザーを更新しました。", null)
      );
    } catch (error) {
      console.error('error update student', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  deleteStudent: async (req, res) => {
    try {
      const username = req.params.id;
      const student = await adminService.deleteStudent({ username });
      res.status(StatusCodes.OK).json(
        createResponse(true, "ユーザーを削除しました。", null)
      );
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
}