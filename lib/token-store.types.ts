export interface TokenRecord {
  token: string | null;
  slug: string;
  email: string;
  exp: number; // epoch ms
}
