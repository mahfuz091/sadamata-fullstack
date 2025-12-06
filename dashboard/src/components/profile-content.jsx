"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { updateUserName } from "@/app/actions/user/user.actions";
import { toast } from "sonner";

export default function ProfileName({ user }) {
  const [name, setName] = useState(user?.name ?? "");
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    if (!name || name.trim().length < 2) {
      setErrorMsg("Please enter a valid name (min 2 chars).");
      return;
    }

    startTransition(async () => {
      try {
        const res = await updateUserName(null, {
          userId: user.id,
          name: name.trim(),
        });

        if (!res?.success) {
          setErrorMsg(res?.msg || "Failed to update name");
          return;
        }

        toast.success("Name updated successfully.");

        // 1) update local UI immediately:
        // (the input already reflects the new name via state)
        // 2) refresh server-rendered UI so other server components show updated name:
        router.refresh();
      } catch (err) {
        console.error("updateUserName error:", err);
        setErrorMsg("An unexpected error occurred.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>View and update your name and email.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='max-w-md space-y-4'>
          <div>
            <Label>Email</Label>
            <div className='mt-1 p-2 rounded-md border bg-muted/10'>
              {user?.email ?? "—"}
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-3'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className='flex items-center gap-3'>
              <Button
                type='submit'
                disabled={isPending}
                className='bg-[#0B7956] text-white   rounded-lg  font-semibold hover:bg-[#0a6b4d] transition-colors cursor-pointer'
              >
                {isPending ? "Updating…" : "Update Name"}
              </Button>
              {statusMsg && (
                <div className='text-sm text-green-600'>{statusMsg}</div>
              )}
              {errorMsg && (
                <div className='text-sm text-red-600'>{errorMsg}</div>
              )}
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
