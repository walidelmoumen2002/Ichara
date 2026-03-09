"use server";

import { signIn } from "@/lib/auth";
import { createUser } from "@/lib/users";
import { AuthError } from "next-auth";

function isRedirectError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    (error as { digest: string }).digest.includes("NEXT_REDIRECT")
  );
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      return { success: true };
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "errorInvalidCredentials" };
        default:
          return { error: "errorGeneric" };
      }
    }
    throw error;
  }

  return { success: true };
}

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "errorAllFieldsRequired" };
  }

  if (password.length < 6) {
    return { error: "errorPasswordLength" };
  }

  try {
    await createUser(name, email, password);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return { error: "errorEmailExists" };
    }
    return { error: "errorGeneric" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      return { success: true };
    }
    if (error instanceof AuthError) {
      return { error: "errorAccountCreatedLoginFailed" };
    }
    throw error;
  }

  return { success: true };
}
