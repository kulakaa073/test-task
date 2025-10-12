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
      <div className="p-[1px] bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF] rounded-full mx-auto">
        <NavbarContent className="flex gap-1 rounded-full overflow-hidden">
          {routes.map((route) => {
            const isActive = pathname === `/${route.route}`;
            return (
              <NavbarItem
                isActive={isActive}
                key={route.name + '_' + route.route}
                className="data-[active=true]:font-bold bg-black py-2 px-6 group"
              >
                <Link
                  href={`/${route.route}`}
                  className="group-data-[active=true]:bg-gradient-to-r group-data-[active=true]:from-pink-500 group-data-[active=true]:to-cyan-500 group-data-[active=true]:text-transparent group-data-[active=true]:bg-clip-text"
                >
                  {route.route}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
      </div>
    </Navbar>
  );
};
