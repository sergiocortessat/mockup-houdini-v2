import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<LinkProps, 'href'> {
  href: LinkProps['href'];
  children: React.ReactNode;
  className?: string;
}

export function NavLink({
  href,
  children,
  className = '',
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();
  // For string hrefs, compare directly; for UrlObject, skip active state
  const isActive = typeof href === 'string' && pathname === href;
  if (isActive) {
    return (
      <span
        className={className + ' cursor-default outline-none'}
        aria-current="page"
        tabIndex={0}
        title="You are on the current page"
      >
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
