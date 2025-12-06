"use client";

import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({ items }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`cursor-pointer flex items-center gap-2 text-lg rounded-lg px-3 py-2 transition-colors duration-200
                      ${
                        isActive
                          ? "bg-[#f37927] !text-white hover:bg-[#dfad8c]  group"
                          : "!text-white hover:bg-gray-100 hover:text-black! bg-[#dfad8c]"
                      }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`h-5 w-5 transition-colors duration-200 ${
                          isActive ? "text-white group-hover:text-white" : ""
                        }`}
                      />
                    )}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
