import { validationResult } from 'express-validator';
import { createResponse } from '../utils/response.utils.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401)
      .json(createResponse(false, 'Validation failed', null, errors.array()));
  }
  next();
}