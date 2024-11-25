export interface AuthenticateRequest {
  user: {
    sub: number;
    firstName: string;
    lastName?: string;
  };
}
