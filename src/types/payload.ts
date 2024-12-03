export interface JwtPayload {
  user: {
    sub: number;
    firstName: string;
    lastName?: string;
  };
}
