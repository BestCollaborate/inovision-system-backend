import { auth } from "../config/config";
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/response.utils.js';
import jwtDecode from "jsonwebtoken"

export const authMiddleware = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split('Bearer ')[1]; // Bearer <token>
  console.log('middlewretoken', token);
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json(createResponse(false, '', null));
  }

  try {
    // Verify the token
    const decodedToken = await jwtDecode.decode(token);
    req.user = decodedToken; // Attach the decoded token to the request
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(StatusCodes.FORBIDDEN).json(createResponse(false, '', null));
  }
};