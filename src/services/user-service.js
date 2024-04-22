import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const accessToken = jwt.sign({ userId: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });
  const refreshToken = jwt.sign({ userId: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

  return prismaClient.user.update({
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken
    },
    where: {
      username: user.username,
    },
    select: {
      username: true,
      password: true,
      accessToken: true,
      refreshToken: true
    },
  });
};

const get = async (authHeader) => {
  const accessToken = authHeader.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  const user = await prismaClient.user.findUnique({
    where: {
      username: decoded.userId,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  return user;
};

const update = async (request) => {
  const user = validate(updateUserValidation, request);

  const totalUserInDatabase = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "user is not found");
  }

  const data = {};
  if (user.name) {
    data.name = user.name;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  return prismaClient.user.update({
    where: {
      username: user.username,
    },
    data: data,
    select: {
      username: true,
      name: true,
    },
  });
};

const logout = async (authHeader) => {
  const accessToken = authHeader.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  const user = await prismaClient.user.findUnique({
    where: {
      username: decoded.userId,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  return prismaClient.user.update({
    where: {
      username: decoded.userId,
    },
    data: {
      accessToken: null,
      refreshToken: null
    },
    select: {
      username: true,
    },
  });
};

export default {
  register,
  login,
  get,
  update,
  logout
};
