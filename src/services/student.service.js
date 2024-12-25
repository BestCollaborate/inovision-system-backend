import { db } from '../config/config';

export const studentService = {
  getProfile: async (getData) => {
    const { uid } = getData;
    try {
      const studentRef = db.collection('student').doc(uid);
      const doc = await studentRef.get();
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
      const studentRef = db.collection('student').doc(uid);
      const doc = await studentRef.get();
      if (doc.empty) {
        throw new Error("ユーザーが存在しません");
      } else {
        await studentRef.update(updateData);
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, 
  deleteProfile: async (deleteData) => {
    const { uid } = deleteData;
    try {
      const studentRef = db.collection('student').doc(uid);
      const doc = await studentRef.get();
      if (doc.empty) {
        throw new Error("ユーザーが存在しません");
      } else {
        await studentRef.delete();
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};