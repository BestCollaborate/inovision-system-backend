import { StatusCodes } from 'http-status-codes';

import { authService } from '../services/auth.service.js';
import { createResponse } from '../utils/response.utils.js';

export const authController = {
  signUp: async (req, res) => {
    console.log('signup', req.body);
    try {
      const { email, password, username, fullname, furigana, gender, role } = req.body;
      const userRecord = await authService.signUp({
        email,
        password,
        username,
        fullname,
        furigana,
        gender,
        role
      });
      console.log('userRecode', userRecord.email);

      res.status(StatusCodes.CREATED).json(
        createResponse(true, '成果的に登録されました。', {
          uid: userRecord.uid,
          username: userRecord.username,
          email: userRecord.email
        })
      );
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse(false, '登録に失敗しました。', null, error.message)
      );
    }
  },
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('login controller', email, password);

      const userCredential = await authService.signInUser({ email, password });
      console.log('userCredential', userCredential);
      res.status(StatusCodes.OK).json(
        createResponse(true, 'ログインに成功しました。', {
          token: userCredential.token
        })
      );
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(StatusCodes.UNAUTHORIZED).json(
        createResponse(false, 'ログインに失敗しました。', null, error.message)
      );
    }

  },
  signOut: async (req, res) => {
    console.log('signout req', req.user);

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