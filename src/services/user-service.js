import { prismaClient } from "../applications/database"
import { ResponseError } from "../error/response-error"
import { registerUserValidation } from "../validations/user-validation"
import { validate } from "../validations/validation"
import bcrypt from "bcrypt"

const register = async (request) => {
  const user = validate(registerUserValidation, request)

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username
    }
  })

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists")
  }

  user.password = await bcrypt.hash(user.password, 10)

  const result = await prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true
    }
  })

  return result
}