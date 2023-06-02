import type { RoleTypeEnum, TokenTypeEnum } from '../constants';

export interface IPayload {
  userId: Uuid;
  role: RoleTypeEnum;
  type: TokenTypeEnum;
  iat: number;
}
