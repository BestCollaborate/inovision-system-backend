import { auth, db } from '../config/config';
import { helperService } from './helper.service';
import { tokenUtils } from '../utils/token.utils';

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

      console.log('Firebase Auth user created successfully:', adminRecord.uid);
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
          id: doc.uid,   // Document ID
          ...doc.data() // Document data
        }));
        console.log("teacherRef", teachers);
        // return teacherRef.docs()
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteAdmin: async () => {
    try {
      console.log('delete');
      await auth.deleteUser("L0z7du5hzsYCz8f8Sy3OF5TdaZe2");
      console.log('deleteadmin');

    } catch (error) {
    }
  }
}