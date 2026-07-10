import { AppError } from './errorHandler.js';

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(new AppError('Access denied. Architect only.', 403));
};