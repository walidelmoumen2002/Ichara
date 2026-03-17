"use server";

import { createUser } from "@/lib/users";

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

  return { success: true };
}
