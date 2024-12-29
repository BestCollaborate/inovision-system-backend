import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response.utils.js';
import { studentService } from '../services/student.service.js';

export const studentController = {
  getProfile: async (req, res) => {
    try {
      const username = req.params.id;
      const profile = await studentService.getProfile({ username });
      res.status(StatusCodes.OK).json(
        createResponse(true, "", profile)
      );
    } catch (error) {
      console.error('error get profile', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  updateProfile: async (req, res) => {
    try {
      const username = req.params.id;
      const updateData = req.body;
      const profile = await studentService.updateProfile({ username, updateData });
      res.status(StatusCodes.OK).json(
        createResponse(true, "プロフィールを更新しました。", null)
      );
    } catch (error) {
      console.error('error update profile', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const username = req.user.uid;
      const profile = await studentService.deleteProfile({ username });
      res.status(StatusCodes.OK).json(
        createResponse(true, "プロフィールを削除しました。", null)
      );
    } catch (error) {
      console.error('error delete profile', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ユーザーが見つかりません。', null,)
      );
    }
  },
};