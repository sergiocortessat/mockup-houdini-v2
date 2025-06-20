export type NavigationItem = {
  nameKey: string;
  href: string;
  icon?: React.ElementType;
  target?: string;
  isDropdown?: boolean;
  dropdownItems?: {
    title: string;
    items: {
      name: string;
      href: string;
      target?: string;
    }[];
  }[];
};
