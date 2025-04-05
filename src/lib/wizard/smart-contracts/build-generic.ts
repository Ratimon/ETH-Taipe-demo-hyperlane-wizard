

import type { SharedERC20Options} from '../shared/bridge/1-option-erc20';
import { buildERC20 } from './bridge/1-erc20-primary';

;

export interface KindedOptions {


    ERC20: { kind: 'ERC20' } & SharedERC20Options;

}

export type GenericOptions = KindedOptions[keyof KindedOptions];

export function buildContractGeneric(opts: GenericOptions) {
    switch (opts.kind) {


        case 'ERC20':
            return buildERC20(opts);
        

        // default:
        //     const _: never = opts;
        //     throw new Error('Unknown Contract');
    }
}
  