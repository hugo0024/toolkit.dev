"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthProviderIcon } from "../navbar/account-button/provider-icon";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface AuthButtonsProps {
  providers: {
    name: string;
    id: string;
  }[];
  redirect?: string;
}

export const AuthButtons = ({ providers, redirect }: AuthButtonsProps) => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSignIn = async (providerId: string) => {
    setLoadingProvider(providerId);
    try {
      await signIn(providerId, { redirectTo: redirect });
    } catch {
      // Reset loading state if sign in fails
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          className="w-full"
          disabled={loadingProvider !== null}
          onClick={() => handleSignIn(provider.id)}
        >
          {loadingProvider === provider.id ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <AuthProviderIcon provider={provider.name} />
              Sign in with {provider.name}
            </>
          )}
        </Button>
      ))}
    </div>
  );
};
