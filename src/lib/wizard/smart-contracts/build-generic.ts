

import type { SharedERC20Options} from '../shared/bridge/1-option-erc20';
import { buildERC20 } from './bridge/1-erc20-primary';

import type { SharedERC4626Options } from '../shared/bridge/1-option-erc4626';
import { buildERC4626 } from './bridge/1-erc4626-primary';

import type { SharedXERC20Options} from '../shared/bridge/1-option-xerc20';
import { buildXERC20 } from './bridge/1-xerc20-primary';

import type { SharedXERC20LockboxOptions } from '../shared/bridge/1-option-xerc20lockbox';
import { buildXERC20Lockbox } from './bridge/1-xerc20lockbox-primary';


export interface KindedOptions {


    ERC20: { kind: 'ERC20' } & SharedERC20Options;
    ERC4626: { kind: 'ERC4626' } & SharedERC4626Options;
    XERC20: { kind: 'XERC20' } & SharedXERC20Options;
    XERC20Lockbox: { kind: 'XERC20Lockbox' } & SharedXERC20LockboxOptions;

}

export type GenericOptions = KindedOptions[keyof KindedOptions];

export function buildContractGeneric(opts: GenericOptions) {
    switch (opts.kind) {


        case 'ERC20':
            return buildERC20(opts);
        
        case 'ERC4626':
            return buildERC4626(opts);

        case 'XERC20':
            return buildXERC20(opts);

        case 'XERC20Lockbox':
            return buildXERC20Lockbox(opts);
        
        default:
            const _: never = opts;
            throw new Error('Unknown Contract');
    }
}
  