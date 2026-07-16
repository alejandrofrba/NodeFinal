import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token ausente
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next({ status: 401, message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Token expirado
    if (err.name === 'TokenExpiredError') {
      return next({ status: 403, message: 'El token ha expirado' });
    }
    // Token inválido
    return next({ status: 403, message: 'Token inválido' });
  }
};

export default authMiddleware;
