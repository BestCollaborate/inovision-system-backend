import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response.utils.js';
import { parentService } from '../services/parent.service.js';
import { log } from 'winston';

export const parentController = {
  createStudent: async (req, res) => {
    // console.log("createStudent controller", req.body);
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
  }
}