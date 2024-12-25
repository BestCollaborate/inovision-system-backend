
export const studentController = {
  getProfile: async (req, res) => {
    try {
      const uid = req.params.id;
      const profile = await studentService.getProfile({ uid });
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
      const profile = await studentService.updateProfile({ uid, updateData });
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
      const profile = await studentService.deleteProfile({ uid });
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