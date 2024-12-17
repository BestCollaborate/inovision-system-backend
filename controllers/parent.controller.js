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
      console.log("parentId", parentId);
      const child = await parentService.getChild({ parentId });
      console.log("getChild", child);
      res.status(StatusCodes.OK).json(
        createResponse(true, child)
      );
    } catch (error) {
      console.error('');
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, error.message)
      );
    }
  }
}