'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavLink } from '@/components/ui/nav-link';
import { navigationItems } from '@/constants';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('');

  return (
    <nav className="flex h-full w-full flex-row items-center space-x-2 text-sm font-medium">
      {navigationItems.length > 0 &&
        navigationItems?.map((item) => {
          if (item.isDropdown) {
            return (
              <DropdownMenu key={t(item.nameKey)}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-foreground/60 hover:text-foreground/80 hover:bg-accent/50 flex h-full justify-start gap-1 rounded-md px-0 transition-colors lg:rounded-none lg:px-6"
                  >
                    {t(item.nameKey)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[240px]">
                  {item.dropdownItems?.map((section) => (
                    <div key={section.title} className="px-2 py-2">
                      <div className="text-foreground/50 mb-2 text-xs font-semibold">
                        {t(section.title)}
                      </div>
                      {section.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            href={subItem.href}
                            target={subItem.target}
                            rel="noopener noreferrer"
                            className={cn(
                              'text-foreground/70 hover:text-foreground hover:bg-accent/50 rounded-md px-2 py-1.5',
                              pathname === subItem.href &&
                                'lg:border-accent bg-card text-accent-foreground lg:border-b-2'
                            )}
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <NavLink
              key={item.nameKey}
              href={item.href}
              target={item.target}
              className={cn(
                'text-foreground/60 hover:text-foreground/80 hover:bg-accent/50 flex h-full items-center gap-2 rounded-md p-2 transition-colors lg:rounded-none lg:px-6 lg:py-0',
                pathname === item.href &&
                  'lg:border-accent bg-accent/50 lg:bg-card lg:text-accent-foreground lg:border-b-2'
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {t(item.nameKey)}
            </NavLink>
          );
        })}
    </nav>
  );
}
