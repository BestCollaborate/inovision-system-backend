import { db } from '../config/config';

export const studentService = {
  getProfile: async (getData) => {
    const { username } = getData;
    try {
      const studentRef = db.collection('student').doc(username);
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
    const { username, updateData } = data;
    try {
      const studentRef = db.collection('student').doc(username);
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
    const { username } = deleteData;
    try {
      const studentRef = db.collection('student').doc(username).delete();
      return;
    } catch (error) {
      throw new Error("ユーザーが存在しません");
    }
  },
};