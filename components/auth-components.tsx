"use client";

import { signInAction, signOutAction } from "./auth-actions";

export function SignIn({ provider }: { provider?: string }) {
  return (
    <form action={signInAction.bind(null, provider)}>
      <button className="bg-blue-500 text-white p-2 rounded-md">Sign In</button>
    </form>
  );
}

export function SignOut() {
  return (
    <form action={signOutAction}>
      <button className="bg-blue-500 text-white p-2 rounded-md">Sign Out</button>
    </form>
  );
}
