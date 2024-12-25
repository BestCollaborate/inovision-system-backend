import { db } from '../config/config';

export const teacherService = {
  getProfile: async ({ uid }) => {
    // const { uid } = getData;

    try {
      const teacherRef = db.collection('teacher').doc(uid);
      const doc = await teacherRef.get();
      if (doc.empty) {
        throw new Error("ユーザーが存在しません");
      } else {
        return doc.data();
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  updateProfile: async (data) => {
    const { uid, updateData } = data;
    try {
      const teacherRef = db.collection('teacher').doc(uid);
      const doc = await teacherRef.get();
      if (doc.empty) {
        throw new Error("ユーザーが存在しません");
      } else {
        await teacherRef.update(updateData);
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteProfile: async (deleteData) => {
    const { uid } = deleteData;
    try {
      const teacherRef = db.collection('teacher').doc(uid);
      const doc = await teacherRef.get();
      if (doc.empty) {
        throw new Error("ユーザーが存在しません");

      } else {
        await teacherRef.delete();
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};