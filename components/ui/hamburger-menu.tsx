'use client';

import { ChevronDown, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavLink } from '@/components/ui/nav-link';
import { menuItems, navigationItems } from '@/constants';
import { cn } from '@/lib/utils';

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations('');

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('common.toggleMenu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-4 p-4">
        <h2 className="text-heading-lg border-b pb-4">{t('sections.title')}</h2>
        <div className="flex flex-col gap-y-1">
          {navigationItems.length > 0 &&
            navigationItems?.map((item) => {
              if (item.isDropdown) {
                return (
                  <DropdownMenu key={t(item.nameKey)}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-label-md text-foreground/70 hover:text-foreground hover:bg-accent/50 flex items-center justify-start rounded-md px-2 py-1.5"
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {t(item.nameKey)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[240px]">
                      {item.dropdownItems?.map((section) => (
                        <div key={section.title} className="px-2 py-1">
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
                                  'text-label-md text-foreground/70 hover:text-foreground hover:bg-accent/50 flex items-center rounded-md p-2',
                                  pathname === subItem.href &&
                                    'bg-accent text-accent-foreground'
                                )}
                                onClick={() => setIsOpen(false)}
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
                  rel="noopener noreferrer"
                  className={cn(
                    'text-label-md text-foreground/70 hover:text-foreground hover:bg-accent/50 flex items-center rounded-md px-2 py-1.5',
                    pathname === item.href && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {t(item.nameKey)}
                </NavLink>
              );
            })}
        </div>

        <div>
          <h2 className="text-foreground/50 mb-2 text-xs font-semibold tracking-wider">
            {t('sections.about.title')}
          </h2>
          <div className="flex flex-col gap-y-1">
            {menuItems.about.map((item) => (
              <Link
                key={t(item.nameKey)}
                href={item.href}
                target={item.target}
                rel="noopener noreferrer"
                className={cn(
                  'text-label-md text-foreground/70 hover:text-foreground hover:bg-accent/50 flex items-center rounded-md px-2 py-1.5',
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {t(item.nameKey)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-foreground/50 mb-2 text-xs font-semibold tracking-wider">
            {t('sections.social.title')}
          </h2>
          <div className="flex flex-col gap-y-1">
            {menuItems.social.map((item) => (
              <Link
                key={t(item.nameKey)}
                href={item.href}
                target={item.target}
                rel="noopener noreferrer"
                className={cn(
                  'text-label-md text-foreground/70 hover:text-foreground hover:bg-accent/50 flex items-center rounded-md px-2 py-1.5',
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {t(item.nameKey)}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-4 border-t pt-4 text-sm">
          {menuItems.footer.map((item) => (
            <Link
              key={t(item.nameKey)}
              href={item.href}
              target={item.target}
              rel="noopener noreferrer"
              className="hover:text-foreground text-label-md text-foreground/70"
            >
              {t(item.nameKey)}
            </Link>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
