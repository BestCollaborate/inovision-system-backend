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
      
      await parentService.deleteChild(username);
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
}