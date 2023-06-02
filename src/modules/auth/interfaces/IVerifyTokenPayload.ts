import type { TokenTypeEnum } from '../../../constants';

export interface IVerifyTokenPayload {
  userId?: Uuid;
  type?: TokenTypeEnum;
}
