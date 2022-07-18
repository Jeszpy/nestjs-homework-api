
export type UserAccountDBType = {
    accountData: UserAccountType,
    loginAttempts: LoginAttemptType[],
    emailConfirmation: EmailConfirmationType
}

export type UserInfoType = {
    userId: string,
    login: string,
    email: string,
}

export type UserAccountType = {
    id: string,
    login: string,
    email: string,
    password: string,
    createdAt: Date
}

export type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
    sentEmails: SentConfirmationEmailType[]
}

export type SentConfirmationEmailType = {
    sentDate: Date
}

export type LoginAttemptType = {
    attemptDate: Date
    ip: string
}

export type UserIdAndLoginType = {
    id: string,
    login: string
}