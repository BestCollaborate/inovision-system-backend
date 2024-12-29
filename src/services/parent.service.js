import { auth, db } from '../config/config';
import { get } from '../routes/videosdk.route';
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
      const studentsRef = db.collection('student');
      // console.log(studentsRef);

      const snapshot = await studentsRef.where('parentId', '==', parentId).get();
      // console.log(snapshot);
      if (snapshot.empty) {
        throw new Error("ユーザーが存在しません");
      }
      const children = [];
      snapshot.forEach(doc => {
        children.push({ id: doc.username, ...doc.data() });
      });
      return children;
    } catch (error) {
      throw new Error(error);
    }
  },
  changeChild: async ({ changeData, username }) => {
    try {
      const docRef = db.collection("student").doc(username);

      // Update document
      const update = await docRef.update(changeData);

      return;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  deleteChild: async (username) => {
    try {
      console.log('deleteadmin', username);
      const docRef = db.collection('student').doc(username);
      const deleteDoc = await docRef.delete();
      return deleteDoc;
    } catch (error) {
      throw new Error("");
    }
  },
  getProfile: async ({ uid }) => {
    try {
      const docRef = db.collection('parent').doc(uid);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        return data;
      } else {
        throw new Error("ユーザーが見つかりません");
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  updateProfile: async ({ uid, updateData }) => {
    console.log(uid, updateData);

    try {
      const docRef = db.collection('parent').doc(uid);
      const update = await docRef.update(updateData);
      return update;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteProfile: async ({ uid }) => {
    try {
      const deleteFromAdmin = await auth.deleteUser(uid);
      console.log("deleteparent");

      const docRef = db.collection('parent').doc(uid).delete();
      return;
    } catch (error) {
      throw new Error("ユーザーが存在しません");
    }
  }
}