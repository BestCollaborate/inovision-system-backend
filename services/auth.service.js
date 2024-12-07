import { sendVerificationEmail } from './emailVerifyService';
import { auth, db } from '../config/config';
import { helperService } from './helper.service';

export const authService = {
  signUp: async (userData) => {
    const { email, password, username, fullname, furigana, gender, role } = userData;

    try {
      console.log('Creating user with data:', { email, username, fullname, furigana, gender, role });
      const { hash, salt } = await helperService.hashPassword(password);

      // Create Firebase auth user
      const userRecord = await auth.createUser({
        email,
        password,
        emailVerified: false,
        displayName: username
      });

      console.log('Firebase Auth user created successfully:', userRecord.uid);
      // Send verification email
      // const verificationLink = await auth.generateEmailVerificationLink(email);

      // Store additional user data in Firestore
      const userDocRef = db.collection('users').doc(userRecord.uid);
      await userDocRef.set({
        username,
        fullname,
        furigana,
        gender,
        role,
        email,
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // await sendVerificationEmail(email, verificationLink);

      console.log('User data stored in Firestore successfully');

      return userRecord;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },
  signInUser: async (signInData) => {
    try {
      const { email, password } = signInData;
      console.log('login info', email, password);

      const userCredential = await auth.getUserByEmail(email);
      console.log('user======', userCredential);

      // if (!userCredential.emailVerified) {
      //   throw new Error('EMAIL_NOT_VERIFIED');
      // };

      // Get additional user data from Firestore
      const userDoc = await db.collection('users').doc(userCredential.uid).get();
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
        username: userInfo.role,
        role: userInfo.username,
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
  signOut: async (uid) => {
    try {
      await auth.revokeRefreshTokens(uid);
      console.log(`Refresh tokens revoked for user: ${uid}`);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }
};
