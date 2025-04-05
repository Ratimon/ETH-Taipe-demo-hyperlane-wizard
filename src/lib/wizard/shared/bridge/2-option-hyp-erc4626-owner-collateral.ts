import type { CommonOptions} from '../common-options';
import { defaults as infoDefaults } from "../set-info";


export const commonDefaults: Required<CommonOptions> = {
    //contract
    access: false,
    upgradeable: false,
    contractInfo: infoDefaults,
  
    //deploy
    deployInfo: infoDefaults,
  
    //test
    testInfo: infoDefaults,
} as const;
  
  
export function withCommonDefaults(opts: CommonOptions): Required<CommonOptions> {
    return {
      access: opts.access ?? false,
      upgradeable: opts.upgradeable ?? false,
      contractInfo: opts.contractInfo ?? {},
      
      deployInfo: opts.deployInfo ?? {},
  
      testInfo: opts.testInfo ?? {},
    };
}


export interface SharedHypERC4626OwnerCollateralOptions extends CommonOptions {
    contractName: string;
}
  
export const defaults: Required<SharedHypERC4626OwnerCollateralOptions> = {
    contractName: 'HypERC4626OwnerCollateral',

    access: commonDefaults.access,
    upgradeable: commonDefaults.upgradeable,
    contractInfo: commonDefaults.contractInfo,

    deployInfo: commonDefaults.deployInfo,

    testInfo: commonDefaults.testInfo,
} as const;

export function withDefaults(opts: SharedHypERC4626OwnerCollateralOptions): Required<SharedHypERC4626OwnerCollateralOptions> {
    return {
        ...opts,
        ...withCommonDefaults(opts),
    };
}