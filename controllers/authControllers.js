import { StatusCodes } from 'http-status-codes';

import { authService } from '../services/auth.service.js';
import { createResponse } from '../utils/response.utils.js';

export const authController = {
  signUp: async (req, res) => {
    console.log('signup', req.body);
    try {
      const { email, password, username } = req.body;
      const userRecord = await authService.signUp({
        email,
        password,
        username
      });
      console.log('userRecode', userRecord);

      res.status(StatusCodes.CREATED).json(
        createResponse(true, '成果的に登録されました。', { uid: userRecord })
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
  googleSignUp: async (req, res) => {
    // console.log("google signup", req.body.data);
    try {
      const Id_token = req.body.data;
      const userCredential = await authService.googleSignUp(Id_token);
      console.log('google controller', userCredential);
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
    console.log('google-signin', req.body.id_token);
    try {
      const userCredential = await authService.googleSignIn(req.body.id_token);
      console.log('userCredential', userCredential);
      res.status(StatusCodes.OK).json(
        createResponse(true, 'ログインに成功しました。', {
          token: userCredential
        })
      );
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(StatusCodes.UNAUTHORIZED).json(
        createResponse(false, 'ログインに失敗しました。', null, error.message)
      );
    }
  },
  createProfile: async (req, res) => {
    console.log(req.params.id);
    try {
      const uid = req.params.id;
      const data = req.body;
      console.log('dataooooioioiopio', data);

      const resData = await authService.createPrifile({ uid, data });
      res.status(StatusCodes.OK).json(
        createResponse(true, 'プロフィールを登録しました。', {
          token: resData
        })
      );
    } catch (error) {
      console.error("error crateprofile", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse(false, 'サーバーに問題が発生しました。', null)
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