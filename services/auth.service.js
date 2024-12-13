import { sendVerificationEmail } from './emailVerifyService';
import { auth, db } from '../config/config';
import { helperService } from './helper.service';
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const authService = {
  signUp: async (userData) => {
    const { email, password, role } = userData;

    try {
      console.log('Creating user with data:', { email, role, password });
      const { hash, salt } = await helperService.hashPassword(password);

      // Create Firebase auth user
      const userRecord = await auth.createUser({
        email,
        password,
        emailVerified: false,
      });

      console.log('Firebase Auth user created successfully:', userRecord.uid);
      // Send verification email
      // const verificationLink = await auth.generateEmailVerificationLink(email);

      // Store additional user data in Firestore
      if (role === "teacher") {
        const teacherDoc = db.collection(role).doc(userRecord.uid);
        await teacherDoc.set({
          username: "",
          fullname: "",
          furigana: "",
          gender: "",
          role: role,
          email,
          passwordHash: hash,
          passwordSalt: salt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        const parentDoc = db.collection(role).doc(userRecord.uid);
        await parentDoc.set({
          fullname: "",
          furigana: "",
          gender: "",
          role: role,
          email,
          phonenumber: "",
          passwordHash: hash,
          passwordSalt: salt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // try {
      //   const emailVerified = await sendVerificationEmail(email, verificationLink);
      //   console.log('emailverified', emailVerified);
      // } catch (error) {
      //   console.error('verifyerror', error);
      //   throw new Error("Can not send verify email");
      // }

      console.log('User data stored in Firestore successfully');
      return {
        uid: userRecord.uid,
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },
  signInUser: async (signInData) => {
    try {
      const { email, password, role } = signInData;
      // console.log('login info', email, password);

      const userCredential = await auth.getUserByEmail(email);
      console.log('user======', userCredential);

      // if (!userCredential.emailVerified) {
      //   throw new Error('EMAIL_NOT_VERIFIED');
      // };

      // Get additional user data from Firestore
      const userDoc = await db.collection(role).doc(userCredential.uid).get();
      if (!userDoc.exists) {
        console.log('No such user document!');
        return;
      }
      const userInfo = userDoc.data();
      console.log('userDoc', userInfo);

      const isPasswordValid = await helperService.verifyPasswordHash(
        password,
        userInfo.passwordHash,
        userInfo.passwordSalt
      );
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      };

      const additionalClaims = {
        username: userInfo.username,
        role: userInfo.role,
      };
      // Get the user's ID token
      console.log('tokenid', userCredential.uid);

      const token = await auth.createCustomToken(userCredential.uid, additionalClaims);
      console.log('token==', token);

      return {
        token: token
      };
    } catch (error) {
      console.error('Error in signInUser:', error);
      throw new Error('Invalid email or password');
    }
  },
  googleSignUp: async (data) => {
    // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { id_token, role } = data;
    console.log(data);
    const ticket = jwtDecode(id_token);
    // console.log('google servise', ticket);
    const { email, family_name, given_name } = ticket;
    const userRecord = await auth.getUserByEmail(email).catch(() => null);
    if (!userRecord) {
      try {
        const newUser = await auth.createUser({
          email: email,
          emailVerified: true,
          displayName: family_name,
        });

        const userDocRef = db.collection(role).doc(newUser.uid);
        await userDocRef.set({
          fullname: `${family_name} ${given_name}`,
          furigana: "",
          role: role,
          email,
          passwordHash: "",
          passwordSalt: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return {
          user: newUser,
          success: true
        }
      } catch (error) {
        throw error;
      }
    } else {
      return {
        user: null,
        success: false
      }
    }
  },
  googleSignIn: async (data) => {
    try {
      const { id_token, role } = data;
      const ticket = jwtDecode(id_token);
      console.log('google servise', data);
      const { email } = ticket;

      const userCredential = await auth.getUserByEmail(email);
      console.log('user======', userCredential);

      // Get additional user data from Firestore
      const userDoc = await db.collection(role).doc(userCredential.uid).get();
      if (!userDoc.exists) {
        console.log('No such user document!');
        return;
      };

      const userInfo = userDoc.data();
      console.log('userDoc', userInfo);

      const additionalClaims = {
        username: userInfo.username,
        fullname: userInfo.fullname,
        role: userInfo.role,
      };
      // Get the user's ID token
      console.log('tokenid', userCredential.uid);

      const token = await auth.createCustomToken(userCredential.uid, additionalClaims);
      console.log('token==', token);

      return token;
    } catch (error) {
      console.error('Error in signInUser:', error);
      throw new Error('Invalid email or password');
    }
  },
  createPrifile: async (upData) => {
    console.log(upData);
    const { role, username } = upData.data;
    try {
      const docRef = db.collection(role).doc(upData.uid);

      // Update document
      const update = await docRef.update(upData.data);
      console.log('update==', update, docRef);
      const additionalClaims = {
        username: username,
        role: role
      };
      // Get the user's ID token
      console.log('tokenid', upData.uid);

      const token = await auth.createCustomToken(upData.uid, additionalClaims);
      console.log('token==', token);

      return token;
    } catch (error) {
      console.error('Error updating document:', error);
      return error;
    }
  },
  signOut: async (uid) => {
    try {
      await auth.revokeRefreshTokens(uid);
      console.log(`Refresh tokens revoked for user: ${uid}`);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }
};
