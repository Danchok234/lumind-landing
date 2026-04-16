import type {
  ForgotPasswordFormValues,
  FormErrors,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
  VerifyEmailFormValues,
} from '@/types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const VERIFY_CODE_REGEX = /^\d{4,8}$/;

export function validateLoginForm(
  values: LoginFormValues,
): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Enter a valid email';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export function validateRegisterForm(
  values: RegisterFormValues,
): FormErrors<RegisterFormValues> {
  const errors: FormErrors<RegisterFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Enter a valid email';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < MIN_PASSWORD) {
    errors.password = `Password must be at least ${MIN_PASSWORD} characters`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues,
): FormErrors<ForgotPasswordFormValues> {
  const errors: FormErrors<ForgotPasswordFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Enter a valid email';
  }

  return errors;
}

export function validateResetPasswordForm(
  values: ResetPasswordFormValues,
): FormErrors<ResetPasswordFormValues> {
  const errors: FormErrors<ResetPasswordFormValues> = {};

  if (!values.token.trim()) {
    errors.token = 'Reset token is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < MIN_PASSWORD) {
    errors.password = `Password must be at least ${MIN_PASSWORD} characters`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export function validateVerifyEmailForm(
  values: VerifyEmailFormValues,
): FormErrors<VerifyEmailFormValues> {
  const errors: FormErrors<VerifyEmailFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Enter a valid email';
  }

  if (!values.code.trim()) {
    errors.code = 'Verification code is required';
  } else if (!VERIFY_CODE_REGEX.test(values.code.trim())) {
    errors.code = 'Code should contain 4 to 8 digits';
  }

  return errors;
}
