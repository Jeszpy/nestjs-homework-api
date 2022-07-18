export type ConnectionLimitsType = {
    ip: string,
    action: string,
    connectionAt: Date
}

export type BlockedConnectionType = {
    ip: string,
    action: string,
    bannedAt: Date
}

export type BlockedUserType = {
    action: string,
    userName: string,
    bannedAt: Date
}