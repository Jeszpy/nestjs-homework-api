import * as mongoose from 'mongoose';
import {
  BlockedConnectionType,
  ConnectionLimitsType,
} from '../types/connectionLimits';

export const connectionsLimitsSchema =
  new mongoose.Schema<ConnectionLimitsType>({
    ip: { type: String, required: true },
    action: { type: String, required: true },
    connectionAt: { type: Date },
  });

export const blockedConnectionsSchema =
  new mongoose.Schema<BlockedConnectionType>({
    ip: { type: String, required: true },
    action: { type: String, required: true },
    bannedAt: { type: Date },
  });
