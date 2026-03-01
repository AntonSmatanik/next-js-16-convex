"use client";

import { authClient } from "@/lib/auth-client";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "../ui/button";
import { SearchInput } from "./SearchInput";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">Next Pro</Link>

        <div className="flex items-center gap-2">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link href="/blog" className={buttonVariants({ variant: "ghost" })}>
            Blog
          </Link>

          <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
            Create
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block mr-2">
            <SearchInput />
          </div>
          {isLoading ? null : isAuthenticated ? (
            <Button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("Logged out successfully");
                      router.push("/");
                    },
                    onError: (error) => {
                      toast.error(error.error.message);
                    },
                  },
                })
              }
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/auth/sign-up" className={buttonVariants()}>
                Sign Up
              </Link>

              <Link
                href="/auth/sign-in"
                className={buttonVariants({ variant: "secondary" })}
              >
                Sign In
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
