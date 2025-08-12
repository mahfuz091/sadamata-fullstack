"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const DashSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/add-design", label: "Create" },
    { href: "/dashboard-manage", label: "Manage" },
    { href: "/dashboard-analyze", label: "Analyze" },
  ];

  return (
    <aside className='dashboard-area__list-area'>
      <div className='dashboard-area__list-area__item'>
        <h2 className='dashboard-area__list-area__title'>Menu</h2>
        <ul className='dashboard-area__list list-unstyled'>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default DashSidebar;
