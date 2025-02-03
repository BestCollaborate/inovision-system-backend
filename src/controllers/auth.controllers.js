import { StatusCodes } from 'http-status-codes';

import { authService } from '../services/auth.service.js';
import { parentService } from '../services/parent.service.js';
import { createResponse } from '../utils/response.utils.js';

export const authController = {
  signUp: async (req, res) => {
    console.log('siginup data9099090', req.body);

    try {
      const { email, password, role } = req.body;
      const userRecord = await authService.signUp({
        email,
        password,
        role
      });
      console.log('userRecode', userRecord);

      res.status(StatusCodes.CREATED).json(
        createResponse(true, '成果的に登録されました。', { uid: userRecord.uid })
      );
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, '登録に失敗しました。', null, error.message)
      );
    }
  },
  studentSignUp: async (req, res) => {
    console.log(req.body);
    const { studentData, parentData } = req.body;
    try {

      const parentRecord = await authService.createParent(parentData);
      const stuData = { ...studentData, parentId: parentRecord.uid };
      const studentRecord = await parentService.createChild(stuData);

      res.status(StatusCodes.CREATED).json(
        createResponse(true, '成果的に登録されました。', {
          uid: studentRecord.username,
          parentId: studentRecord.parentId,
          role: studentRecord.role,
        })
      );
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, `${parentData.email}でユーザーが登録されています。`, null, error.message)
      );
    }
  },
  signIn: async (req, res) => {
    try {
      const role = req.body.role

      if (role === 'student') {
        const { username, password } = req.body.data;
        const userCredential = await authService.signInStudent({ username, password, role });
        console.log('userCredential', userCredential);
        res.status(StatusCodes.OK).json(
          createResponse(true, 'ログインに成功しました。', userCredential)
        );
      } else {
        const { email, password } = req.body.data;
        const userCredential = await authService.signInUser({ email, password, role });
        console.log('userCredential', userCredential);
        res.status(StatusCodes.OK).json(
          createResponse(true, 'ログインに成功しました。', userCredential)
        );
      }
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, error.message)
      );
    }
  },
  googleSignUp: async (req, res) => {
    // console.log("google signup", req.body.data);
    try {
      const { id_token, role } = req.body;
      console.log('google controller', role);
      const userCredential = await authService.googleSignUp({ id_token, role });
      if (userCredential.success) {
        res.status(StatusCodes.CREATED).json(
          createResponse(true, '成果的に登録されました。', {
            userData: userCredential.user,
          })
        );
      } else {
        res.status(StatusCodes.OK).json(
          createResponse(false, 'ユーザーはすでに存在しています。', {
            userData: userCredential.user,
          })
        );
      }
    } catch (error) {
      console.error('google-signup', error);
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, '登録に失敗しました。', null, error.message)
      );
    }
  },
  googleSignIn: async (req, res) => {
    const { id_token, role } = req.body.payload;
    try {
      const userCredential = await authService.googleSignIn({ id_token, role });
      console.log('userCredential', userCredential);
      res.status(StatusCodes.OK).json(
        createResponse(true, 'ログインに成功しました。', userCredential)
      );
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse(false, 'ログインに失敗しました。', null, error.message)
      );
      throw new Error("ログインに失敗しました。");

    }
  },
  createProfile: async (req, res) => {
    try {
      const uid = req.params.id;
      const data = req.body;
      console.log('resData', data);


      const resData = await authService.createPrifile({ uid, data });
      console.log('resData', resData);

      res.status(StatusCodes.OK).json(
        createResponse(true, 'プロフィールを登録しました。', resData)
      );
    } catch (error) {
      console.error("error crateprofile", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse(false, 'サーバーに問題が発生しました。', null)
      );
    }
  },
  signOut: async (req, res) => {
    console.log(req.user.uid);

    try {
      await authService.signOut(req.user.uid);
      res.status(StatusCodes.OK).json(
        createResponse(true, 'ログアウトに成功しました。', null)
      )
    } catch (error) {
      console.error('error logout', error);
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(true, 'ログアウトに失敗しました。', null)
      )
    }
  }
}