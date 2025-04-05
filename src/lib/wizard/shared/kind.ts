import type { GenericAllOptions } from './build-generic';

export type Kind = GenericAllOptions['kind'];

export function sanitizeKind(kind: unknown): Kind {
  if (typeof kind === 'string') {
    if (isKind(kind)) {
      return kind;
    }
  }
  return 'ERC20';
}

function isKind<T>(value: Kind | T): value is Kind {
  switch (value) {

    case 'ERC20':
      return true;

    default: {
      // Static assert that we've checked all kinds.
      const _: T = value;
      return false;
    }
  }
}
