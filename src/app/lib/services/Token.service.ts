import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const GenerateToken = async (user: any) => {
  return await jwt.sign({ user: user }, SECRET_KEY, {
    expiresIn: "1d",
  });
};

export const VerifyToken = (token: string) => {
  try {
    if (!token) throw new Error("Token is missing");
    if (!SECRET_KEY) throw new Error("JWT Secret is not defined");

    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};

export const VerifyTokenGetRoleId = async (token: string) => {
  try {
    const verifydata = jwt.verify(token, SECRET_KEY) as JwtPayload;

    return verifydata.user.roleId;
  } catch (error: any) {
    console.error("JWT Verification Failed:", error.message);
    throw new Error("Invalid or expired token");
  }
};

export const VerifyTokenGetUserId = async (token: string) => {
  try {
    const verifydata = jwt.verify(token, SECRET_KEY) as JwtPayload;

    return verifydata.user.userId;
  } catch (error: any) {
    console.error("JWT Verification Failed:", error.message);
    throw new Error("Invalid or expired token");
  }
};

export const GenerateTokenReset = async (user: string) => {
  return await jwt.sign({ user: user }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

export const VerifyTokenReset = async (token: string) => {
  try {
    const verifydata = jwt.verify(token, SECRET_KEY) as JwtPayload;
    // console.log(verifydata.user.userId);
    // const userId = verifydata["userId"];
    // return userId;
    return verifydata.user.userId;
  } catch (error: any) {
    console.error("JWT Verification Failed:", error.message);
    throw new Error("Invalid or expired token");
  }
};
