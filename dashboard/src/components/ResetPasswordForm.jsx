"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Spin } from "antd";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetPassword } from "@/app/actions/auth/resetPassword";

const initialState = { success: false, message: "" };

export function ResetPasswordForm({ className, ...props }) {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [state, formAction, isLoading] = useActionState(
    resetPassword,
    initialState,
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message);
      router.push("/login");
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const invalidLink = !token || !email;
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const tooShort = password.length > 0 && password.length < 8;

  return (
    <div className={cn("flex flex-col gap-6 login", className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Set a new password</CardTitle>
          {!invalidLink && <CardDescription>{email}</CardDescription>}
        </CardHeader>
        <CardContent>
          {invalidLink ? (
            <div className='grid gap-6 text-sm'>
              <p>This reset link is incomplete or expired.</p>
              <Link
                href='/forgot-password'
                className='underline underline-offset-4 text-center'
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <form action={formAction}>
              <input type='hidden' name='token' value={token} />
              <input type='hidden' name='email' value={email} />

              <div className='grid gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='password'>New password</Label>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {tooShort && (
                    <p className='text-sm text-red-600'>
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='confirmPassword'>Confirm new password</Label>
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {mismatch && (
                    <p className='text-sm text-red-600'>Passwords do not match</p>
                  )}
                </div>

                <Button
                  type='submit'
                  disabled={isLoading || tooShort || mismatch || !password}
                  className='bg-[#0B7956] text-white w-full rounded-lg text-base font-semibold hover:bg-[#0a6b4d] transition-colors cursor-pointer'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <Spin size='small' />
                      Updating...
                    </span>
                  ) : (
                    "Update password"
                  )}
                </Button>

                <div className='text-center text-sm'>
                  <Link href='/login' className='underline underline-offset-4'>
                    Back to log in
                  </Link>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
