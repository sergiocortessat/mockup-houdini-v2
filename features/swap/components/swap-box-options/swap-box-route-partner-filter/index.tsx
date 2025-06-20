import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Spinner } from '@/components/ui/spinner';
import { PartnerFilterItem } from '@/features/swap/components/swap-box-options/swap-box-route-partner-filter/partner-filter-item';
import { useRoutePartnerFilters } from '@/features/swap/hooks/use-route-partner-filters';
import {
  GroupPartners,
  RoutePartnerGroup,
  SwapPartner,
} from '@/features/swap/types';

interface SwapBoxRoutePartnerFilterProps {
  groupPartners: GroupPartners;
  isPartnerFilterLoading: boolean;
}

export function SwapBoxRoutePartnerFilter({
  groupPartners,
  isPartnerFilterLoading,
}: SwapBoxRoutePartnerFilterProps) {
  const {
    updateFilteredRoutes,
    updateGroupPartnerFilters,
    isGroupChecked,
    routePartnerFilters,
  } = useRoutePartnerFilters();
  const t = useTranslations('swap.options');
  return (
    <>
      <div>
        <h5 className="text-label-sm mb-4">{t('partners')}</h5>
        <div className="space-y-6">
          {/* DEX Group */}
          <Collapsible className="rounded-xl bg-neutral-800 p-3">
            <div className="flex items-center justify-between">
              <PartnerFilterItem
                id="group-dex"
                partner={t('allDex')}
                count={groupPartners.dex.length}
                checked={isGroupChecked(RoutePartnerGroup.DEX)}
                onCheckedChange={(checked) =>
                  updateGroupPartnerFilters(RoutePartnerGroup.DEX, checked)
                }
              />
              <CollapsibleTrigger asChild>
                <button className="flex items-center rounded p-1 transition-colors hover:bg-neutral-700">
                  <ChevronDown className="transition-transform data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              {isPartnerFilterLoading ? (
                <Spinner />
              ) : (
                <div className="mt-2 ml-3 grid grid-cols-2 gap-4">
                  {groupPartners.dex.map((partner: SwapPartner) => (
                    <PartnerFilterItem
                      key={partner.name}
                      id={`show-${partner.name.toLowerCase()}`}
                      partner={partner.name}
                      checked={routePartnerFilters[partner.name] ?? true}
                      onCheckedChange={updateFilteredRoutes}
                      partnerImage={partner.logoUrl || ''}
                      isDisabled={!partner.enabled}
                    />
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
          {/* CEX Group */}
          <Collapsible className="rounded-xl bg-neutral-800 p-3">
            <div className="flex items-center justify-between">
              <PartnerFilterItem
                id="group-cex"
                partner={t('allCex')}
                count={groupPartners.cex.length}
                checked={isGroupChecked(RoutePartnerGroup.CEX)}
                onCheckedChange={(checked) =>
                  updateGroupPartnerFilters(RoutePartnerGroup.CEX, checked)
                }
              />
              <CollapsibleTrigger asChild>
                <button className="flex items-center rounded p-1 transition-colors hover:bg-neutral-700">
                  <ChevronDown className="transition-transform data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              {isPartnerFilterLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                <div className="mt-2 ml-3 grid grid-cols-2 gap-4">
                  {groupPartners.cex.map((partner: SwapPartner) => (
                    <PartnerFilterItem
                      key={partner.name}
                      id={`show-${partner.name.toLowerCase()}`}
                      partner={partner.name}
                      checked={routePartnerFilters[partner.name] ?? true}
                      onCheckedChange={updateFilteredRoutes}
                      partnerImage={partner.logoUrl || ''}
                      isDisabled={!partner.enabled}
                    />
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
}
