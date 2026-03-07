import { generateToken, verifyToken } from "../../../utils/jwt.js";
import { envVars } from "../../../config/env.js";
import DevBuildError from "../../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";

export const createMobileTokens = (mobileUser) => {
    const jwtPayload = {
        id: mobileUser.id,
        email: mobileUser.email,
        role: mobileUser.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_SECRET_TOKEN,
        envVars.JWT_EXPIRES_IN
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_TOKEN,
        envVars.JWT_REFRESH_EXPIRES_IN
    );

    return { accessToken, refreshToken };
};

export const createNewMobileAccessTokenUsingRefreshToken = async (
    prisma,
    refreshToken
) => {
    const verifyRefreshToken = verifyToken(
        refreshToken,
        envVars.JWT_REFRESH_TOKEN
    );

    const isMobileUser = await prisma.mobileUser.findUnique({
        where: { email: verifyRefreshToken.email },
    });

    if (!isMobileUser) {
        throw new DevBuildError(
            "Mobile user does not exist",
            StatusCodes.BAD_REQUEST
        );
    }

    const jwtPayload = {
        id: isMobileUser.id,
        email: isMobileUser.email,
        roles: isMobileUser.roles,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_SECRET_TOKEN,
        envVars.JWT_EXPIRES_IN
    );

    return accessToken;
};
