require('dotenv').config()

export const settings = {
    mongoUri: process.env.MONGO_URI || '',
    PORT : process.env.PORT || 5001,
    JWT_SECRET: process.env.JWT_SECRET || '123',
    EMAIL_FROM: process.env.EMAIL_FROM || '',
    EMAIL_FROM_PASSWORD: process.env.EMAIL_FROM_PASSWORD || '',
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '10s',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '20s',
}