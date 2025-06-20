import Image from 'next/image';

import { HOUDINI_PRIVATE_PARTNER_LOGO_URL } from '@/constants/urls';

export const HoudiniPrivatePartnerLogo = () => {
  return (
    <Image
      src={HOUDINI_PRIVATE_PARTNER_LOGO_URL}
      alt="Houdini Private Partner Logo"
      width={24}
      height={24}
    />
  );
};
