import { prisma } from "../lib/prisma";
export async function checkIfUserExists(studentId) {
  const user = await prisma.user.findMany({
    where: {
      studentId,
    },
  });
  console.log(user)
  if (user.length > 0) {
    return true;
  }
  return false;
}
