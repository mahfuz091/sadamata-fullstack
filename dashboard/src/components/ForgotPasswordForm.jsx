"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
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

import { sendResetLink } from "@/app/actions/auth/sendResetLink";

const initialState = { success: false, message: "" };

export function ForgotPasswordForm({ className, ...props }) {
  const [state, formAction, isLoading] = useActionState(
    sendResetLink,
    initialState,
  );
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message);
      setSent(true);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6 login", className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Forgot your password?</CardTitle>
          <CardDescription>
            Enter your admin email and we&apos;ll send a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className='grid gap-6 text-sm'>
              <p>
                If an account exists for that email, a reset link is on its way.
                The link expires in 15 minutes.
              </p>
              <Link
                href='/login'
                className='underline underline-offset-4 text-center'
              >
                Back to log in
              </Link>
            </div>
          ) : (
            <form action={formAction}>
              <div className='grid gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='m@example.com'
                    required
                  />
                </div>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='bg-[#0B7956] text-white w-full rounded-lg text-base font-semibold hover:bg-[#0a6b4d] transition-colors cursor-pointer'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <Spin size='small' />
                      Sending...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                <div className='text-center text-sm'>
                  Remembered it?{" "}
                  <Link href='/login' className='underline underline-offset-4'>
                    Log in
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
