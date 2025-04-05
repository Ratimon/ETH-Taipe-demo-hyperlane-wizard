import type { SharedERC20Options} from './bridge/1-option-erc20';

export interface KindedAllOptions {

    ERC20: { kind: 'ERC20' } & SharedERC20Options;

}
export type GenericAllOptions = KindedAllOptions[keyof KindedAllOptions];