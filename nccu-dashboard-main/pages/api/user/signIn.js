// check if user exists, if exist check password, if password is correct, return user
import { prisma } from "../../../lib/prisma";
import { checkIfUserExists } from "../../../utils/checkIfUserExists";
import jwt from "jsonwebtoken";
// generate a jwt token for login user
export default async function handler(req, res) {
  const { studentId, password } = req.body;
  const userExists = await checkIfUserExists(studentId);
  if (userExists) {
    const user = await prisma.user.findMany({
      where: {
        studentId,
      },
    });
    if (user[0].Password === password) {
      const token = jwt.sign(
        { studentId: user[0].studentId },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.json({ token });
      return;
    }
    res.json({ error: "Incorrect password" });
    return;
  }
  res.json({ error: "User does not exist" });
}
