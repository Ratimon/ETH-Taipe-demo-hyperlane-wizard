import type { ContractBuilder } from './contract';
import type { Access, AccessOZ } from './set-access-control';
import {  requireAccessControl, requireAccessControlOZ } from './set-access-control';
import { defineFunctions } from '../utils/define-functions';

export const upgradeableOptions = [false, 'transparent', 'uups'] as const;

export type Upgradeable = typeof upgradeableOptions[number];

export function setUpgradeable(c: ContractBuilder, upgradeable: Upgradeable, access: Access | AccessOZ) {
  if (upgradeable === false) {
    return;
  }

  c.upgradeable = true;

  c.addParent({
    name: 'Initializable',
    path: '@openzeppelin/contracts/proxy/utils/Initializable.sol',
  });

  switch (upgradeable) {
    case 'transparent': break;

    // todo fix it

    case 'uups': {
      // requireAccessControl(c, functions.mintTo, access, 'MINTER','1', 'minter_');
      // requireAccessControl(c, functions._authorizeUpgrade, access, 'UPGRADER','1','upgrader');
      requireAccessControlOZ(c, functions._authorizeUpgrade, access, 'UPGRADER', 'upgrader');
      const UUPSUpgradeable = {
        name: 'UUPSUpgradeable',
        path: '@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol',
      };
      c.addParent(UUPSUpgradeable);
      c.addOverride(UUPSUpgradeable, functions._authorizeUpgrade);
      c.setFunctionBody([], functions._authorizeUpgrade);
      break;
    }

    default: {
      const _: never = upgradeable;
      throw new Error('Unknown value for `upgradeable`');
    }
  }
}

const functions = defineFunctions({
  _authorizeUpgrade: {
    args: [
      { name: 'newImplementation', type: 'address' },
    ],
    kind: 'internal',
  },
});
