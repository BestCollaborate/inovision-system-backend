import { auth, db } from '../config/config';
import { helperService } from './helper.service';

export const adminService = {
  createAdmin: async (adminData) => {
    const { email, password, username, role } = adminData;

    try {
      console.log('Creating user with data:', { email, username, role });
      const { hash, salt } = await helperService.hashPassword(password);

      // Create Firebase auth user
      const adminRecord = await auth.createUser({
        email,
        password,
        emailVerified: false,
        displayName: username
      });

      // Send verification email
      // const verificationLink = await auth.generateEmailVerificationLink(email);

      // Store additional user data in Firestore
      const adminDocRef = db.collection('admin').doc(adminRecord.uid);
      await adminDocRef.set({
        username,
        role,
        email,
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Firebase Auth user created successfully:', adminRecord.uid);
      return userRecord;
    } catch (error) {
      throw error;
    }
  },
  getTeachers: async () => {
    try {
      const teacherRef = await db.collection('teacher').get();
      if (teacherRef.empty) {
        throw new Error("ユーザーが存在しません");
      } else {
        const teachers = teacherRef.docs.map(doc => ({
          ...doc.data() // Document data
        }));
        return teachers
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  updateTeacher: async ({ uid, updateData }) => {
    console.log('upteacher', uid, updateData);
    const teacherRef = db.collection('teacher').doc(uid);
    await teacherRef.update(updateData);
    return;
  },
  deleteTeacher: async ({ uid }) => {
    try {
      console.log('deleteadmin', uid);
      await auth.deleteUser(uid);
      const docRef = db.collection('teacher').doc(uid);
      await docRef.delete();
      return;
    } catch (error) {
      throw new Error("");
    }
  },
  getParents: async () => {
    try {
      const parentsRef = await db.collection('parent').get();
      if (parentsRef.empty) {
        throw new Error("ユーザーが存在しません");
      } else {
        const parents = parentsRef.docs.map(doc => ({
          ...doc.data() // Document data
        }));
        return parents
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  updateParent: async ({ uid, updateData }) => {
    try {
      const parentRef = db.collection('parent').doc(uid);
      await parentRef.update(updateData);
      return;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteParent: async ({ uid }) => {
    try {
      await auth.deleteUser(uid);
      const docRef = db.collection('parent').doc(uid);
      await docRef.delete();
      return;
    } catch (error) {
      throw new Error("");
    }
  },
  getStudents: async () => {
    try {
      const studentsRef = await db.collection('student').get();
      if (studentsRef.empty) {
        throw new Error("ユーザーが存在しません");
      } else {
        const students = studentsRef.docs.map(doc => ({
          ...doc.data() // Document data
        }));
        return students
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  updateStudent: async ({ username, updateData }) => {
    try {
      const studentRef = db.collection('student').doc(username);
      await studentRef.update(updateData);
      return;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteStudent: async ({ username }) => {
    try {
      const studentRef = db.collection('student').doc(username);
      await studentRef.delete();
      return;
    } catch (error) {
      throw new Error("");
    }
  },
  deleteAdmin: async () => {
    try {
      await auth.deleteUser("L0z7du5hzsYCz8f8Sy3OF5TdaZe2");
    } catch (error) {
    }
  }
}
