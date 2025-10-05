'use client';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const routes = [
    { name: 'audio', route: 'audio' },
    { name: 'form', route: 'form' },
    { name: 'stock', route: 'stock' },
  ];

  const pathname = usePathname();

  return (
    <Navbar position="static">
      <NavbarContent>
        {routes.map((route) => {
          const isActive = pathname === `/${route.route}`;
          return (
            <NavbarItem
              isActive={isActive}
              key={route.name + '_' + route.route}
              className="data-[active=true]:font-bold"
            >
              <Link href={`/${route.route}`}>{route.route}</Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
    </Navbar>
  );
};
