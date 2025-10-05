import { Navbar, NavbarContent, NavbarItem } from '@heroui/react';
import Link from 'next/link';

export const Header = () => {
  const routes = [
    { name: 'audio', route: 'audio' },
    { name: 'form', route: 'form' },
    { name: 'stock', route: 'stock' },
  ];

  return (
    <Navbar position="static">
      <NavbarContent>
        {routes.map((route) => (
          <NavbarItem key={route.name + '_' + route.route}>
            <Link href={`/${route.route}`}>{route.route}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>
    </Navbar>
  );
};
