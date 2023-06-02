import type { RoleType, TokenType } from '../../../constants';

export interface IAccessTokenPayload {
  userId: Uuid;
  role: RoleType;
  type: TokenType;
}
