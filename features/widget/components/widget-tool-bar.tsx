import PoweredByHoudiniBadge from '@/features/widget/components/powered-by-houdini-badge';
import WidgetWalletConnectButtons from '@/features/widget/components/widget-wallet-connect-buttons';

const WidgetToolBar = () => {
  return (
    <div className="flex w-full items-center justify-between pt-3">
      <WidgetWalletConnectButtons />
      <PoweredByHoudiniBadge />
    </div>
  );
};

export default WidgetToolBar;
