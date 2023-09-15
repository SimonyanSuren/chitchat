export interface JwtPayload {
  sub: string;
  remoteAddress?: string;
  userAgent?: string;
}
