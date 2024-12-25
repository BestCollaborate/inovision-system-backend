import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response.utils.js';

import { teacherService } from '../services/teacher.service.js';

export const teacherController = {
  getProfile: async (req, res) => {
    try {
      const uid = req.params.id;
      const profile = await teacherService.getProfile({ uid });
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
      const uid = req.params.id;
      const updateData = req.body;
      const profile = await teacherService.updateProfile({ uid, updateData });
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
      const uid = req.params.id;
      const profile = await teacherService.deleteProfile({ uid });
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
