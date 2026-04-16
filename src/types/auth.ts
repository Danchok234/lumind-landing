export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSessionResponse {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthOkResponse {
  success?: boolean;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  display_first_name?: string;
  display_last_name?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface RequestVerifyTokenPayload {
  email: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailFormValues {
  email: string;
  code: string;
}

export type FormErrors<TValues> = Partial<Record<keyof TValues, string>>;
