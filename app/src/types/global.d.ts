declare global {
  interface Window {
    __USER_DATA__?: {
      is_authenticated: boolean;
      username?: string;
      email?: string;
    };
  }
}

export {};
