import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response.utils.js';
import { parentService } from '../services/parent.service.js';
import { log } from 'winston';

export const parentController = {
  createStudent: async (req, res) => {
    const { formData, role } = req.body;
    try {
      const studentRecord = await parentService.createChild({ formData, role });
      res.status(StatusCodes.CREATED).json(
        createResponse(true, "生徒が正常に作成されました。")
      );
    } catch (error) {
      console.error('');
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, "ユーザー名が既に存在します。")
      );
    }
  },
  getChild: async (req, res) => {
    try {
      const parentId = req.params.id;
      const children = await parentService.getChild({ parentId });
      res.status(StatusCodes.OK).json(
        createResponse(true, "", children)
      );
    } catch (error) {
      console.error('');
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, error.message)
      );
    }
  },
  changeChild: async (req, res) => {
    try {
      const username = req.params.id;
      const changeData = req.body;
      const children = await parentService.changeChild({ changeData, username });
      res.status(StatusCodes.OK).json(
        createResponse(true, "正常に変更されました。")
      );
    } catch (error) {
      console.error('');
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, error.message)
      );
    }
  },
  deleteChild: async (req, res) => {
    try {
      const username = req.params.id;
      console.log(username);
      
      const resData = await parentService.deleteChild(username);
      console.log('resDataController', resData);
      res.status(StatusCodes.OK).json(
        createResponse(true, "正常に削除されました。")
      );
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, error.message)
      );
    }
  },
  getProfile: async (req, res) => {
    try {
      const uid = req.params.id;
      console.log(uid);
      
      const profile = await parentService.getProfile({ uid });
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
      const profile = await parentService.updateProfile({ uid, updateData });
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
      const uid = req.user.uid;
      const profile = await parentService.deleteProfile({ uid });
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
}