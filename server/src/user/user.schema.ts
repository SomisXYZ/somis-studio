import { Schema } from 'mongoose'

export type IUserRole = 'ADMIN' | 'USER'
export interface IUser {
    address: string
    name: string
    username: string
    profileUrl?: string
    coverUrl?: string
    role?: IUserRole
    description?: string
    lastLogin?: number
    discordId?: string
    discordHandle?: string
    twitterId?: string
    twitterHandle?: string
}

export const UserSchema = new Schema<IUser>({
    address: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    profileUrl: { type: String, required: false },
    coverUrl: { type: String, required: false },
    role: { type: String, enum: ['USER', 'ADMIN'], required: false },
    description: { type: String, required: false },
    lastLogin: { type: Number, required: false },
    discordId: { type: String, required: false },
    discordHandle: { type: String, required: false },
    twitterId: { type: String, required: false },
    twitterHandle: { type: String, required: false },
})

UserSchema.index({ address: 1 }, { unique: true })
UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ lastLogin: -1 })
