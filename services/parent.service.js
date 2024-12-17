import { auth, db } from '../config/config';
import { helperService } from './helper.service';

export const parentService = {
  createChild: async (childData) => {
    const { password, username, fullname, furigana, gender, parentId, grade } = childData.formData;
    const role = childData.role;
    try {
      console.log('Creating user with data:', childData);
      const { hash, salt } = await helperService.hashPassword(password);
      // Store additional user data in Firestore
      const studentRef = db.collection(role).doc(username);
      const doc = await studentRef.get();
      if (doc.exists) {
        throw new Error("ユーザー名が既に存在します");
      }

      // Save the new user
      await studentRef.set({
        username,
        fullname,
        furigana,
        gender,
        grade,
        role,
        parentId,
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Firebase Auth user created successfully:', studentRef);
      return studentRef;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  getChild: async (getData) => {
    const { parentId } = getData;
    try {
      console.log("getChildserver", parentId);
      
      const studentsRef = db.collection('student');
      // console.log(studentsRef);
      
      const snapshot = await studentsRef.where('parentId', '==', parentId).get();
      // console.log(snapshot);
      if (snapshot.empty) {
        throw new Error("ユーザーが存在しません");
      }
      const children = [];
      snapshot.forEach(doc => {
        console.log("docmenter", doc);
        children.push({ id: doc.username, ...doc.data() });
      });
      return children;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  changeChild: async () => {
    try {
      console.log("deletechild");
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteChild: async () => {
    try {
      console.log('delete');
      await auth.deleteUser("L0z7du5hzsYCz8f8Sy3OF5TdaZe2");
      console.log('deleteadmin');

    } catch (error) {
      throw new Error("");
    }
  }
}