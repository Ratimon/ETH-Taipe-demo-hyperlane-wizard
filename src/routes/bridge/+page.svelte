<script  lang="ts">
  import type { PageData } from "./$types";
  import type {Link } from '$lib/model/Link';

  import type { Contract } from '$lib/wizard/smart-contracts';
  import { ContractBuilder, buildContractGeneric } from '$lib/wizard/smart-contracts';

  import type {
    KindedPrimaryTokenFromOptions,
    KindedPrimaryTokenToOptions,
    KindPrimaryTokenFrom,
    KindPrimaryTokenTo,
    KindedFromOptions,
    KindedToOptions,
    KindFrom,
    KindTo,
    OptionsErrorMessages
  } from '$lib/wizard/shared';

  import { 
    sanitizeKindFrom,
    sanitizeKindTo,
    sanitizeKindPrimaryTokenFrom,
    sanitizeKindPrimaryTokenTo,
    sanitizeKind,
    OptionsError
  } from '$lib/wizard/shared';


  import {icons} from '$data/icon';

  import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';
  import Button from '$lib/ui/buttons/Button.svelte';
  import Background from '$lib/ui/layouts/Background.svelte';

  type Props = {
      data: PageData;
  } & PageData;

  let { data }: Props = $props();

  const stepLinks : Link[] = [
      {pathname: '#1-select-routes', title: 'Select Routes', navType: 'scroll' },
  ];

  type Route = 'Pick a route'
    | 'Collateral to Synthetic'
    | 'xERC20 Routes';
  type RouteState = 'SettingUproute'
    | 'SettingTokens'
    | 'DeployingPrimaryToken'

  type WarpRoute = {
    state: RouteState;
    route: Route;
    // error?: unknown;
  };

  const warpRouteState: WarpRoute = $state({
    state: 'SettingUproute',
    route: 'Pick a route',
  });

  let initialContractPrimaryTokenFromTab: string | undefined = $state('MyERC20');
  let contractPrimaryTokenFromTab: KindPrimaryTokenFrom = $derived(sanitizeKindPrimaryTokenFrom(initialContractPrimaryTokenFromTab));
  let allOptsPrimaryTokenFrom: { [k in KindPrimaryTokenFrom]?: Required<KindedPrimaryTokenFromOptions [k]> } =  $state({});

  let contractPrimaryTokenFrom: Contract = $state(new ContractBuilder('MyPrimaryToken'));
  const optsPrimaryTokenFrom = $derived(allOptsPrimaryTokenFrom[contractPrimaryTokenFromTab]);

  let errorsPrimaryTokenFrom : { [k in KindPrimaryTokenFrom]?: OptionsErrorMessages } =  $state({});

  $effect(() => {
    if (optsPrimaryTokenFrom) {
      try {
        contractPrimaryTokenFrom = buildContractGeneric(optsPrimaryTokenFrom) as Contract;


        errorsPrimaryTokenFrom[contractPrimaryTokenFromTab] = undefined;
      } catch (e: unknown) {
        if (e instanceof OptionsError) {
            errorsPrimaryTokenFrom[contractPrimaryTokenFromTab] = e.messages;
        } else {
        throw e;
        }
      }
    }
  });

  let initialContractPrimaryTokenToTab: string | undefined = $state('MyERC20');
  let contractPrimaryTokenToTab: KindPrimaryTokenTo = $derived(sanitizeKindPrimaryTokenTo(initialContractPrimaryTokenToTab));
  let allOptsPrimaryTokenTo: { [k in KindPrimaryTokenTo]?: Required<KindedPrimaryTokenToOptions [k]> } =  $state({});

  let contractPrimaryTokenTo: Contract = $state(new ContractBuilder('MyPrimaryToken'));
  const optsPrimaryTokenTo = $derived(allOptsPrimaryTokenTo[contractPrimaryTokenToTab]);

  let errorsPrimaryTokenTo : { [k in KindPrimaryTokenTo]?: OptionsErrorMessages } =  $state({});

  $effect(() => {
    if (optsPrimaryTokenTo) {
      try {
        contractPrimaryTokenTo = buildContractGeneric(optsPrimaryTokenTo) as Contract;
      //   deployContract = buildDeployGeneric(opts);
      //   testContract = buildTestGeneric(opts);

        errorsPrimaryTokenTo[contractPrimaryTokenToTab] = undefined;
      } catch (e: unknown) {
        if (e instanceof OptionsError) {
            errorsPrimaryTokenTo[contractPrimaryTokenToTab] = e.messages;
        } else {
        throw e;
        }
      }
    }
  });


  let contractFromLists = [
    {
      name: 'HypERC20Collateral',
      label: 'HypERC20Collateral.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC20'
    },
    {
      name: 'HypFiatToken',
      label: 'HypFiatToken.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC20'
    },
    {
      name: 'HypERC4626Collateral',
      label: 'HypERC4626Collateral.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC4626'
    },
    {
      name: 'HypERC4626OwnerCollateral',
      label: 'HypERC4626OwnerCollateral',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC4626'
    },
    {
      name: 'FastHypERC20Collateral',
      label: 'FastHypERC20Collateral',
      route: 'Collateral to Synthetic',
      primaryToken: 'ERC20'
    },
    {
      name: 'HypXERC20Lockbox',
      label: 'HypXERC20Lockbox.sol',
      route: 'xERC20 Routes',
      primaryToken: 'XERC20Lockbox'
    },
    {
      name: 'HypXERC20',
      label: 'HypXERC20.sol',
      route: 'xERC20 Routes',
      primaryToken: 'XERC20'
    },
    
  ]

  let contractFromListsFiltered = $derived(
     contractFromLists.filter(contract => contract.route === warpRouteState.route)
  )

  let initialContractFromTab: string | undefined = $state(undefined);
  let contractFromTab : KindFrom = $derived(sanitizeKindFrom(initialContractFromTab));
  let allOptsFrom: { [k in KindFrom]?: Required<KindedFromOptions [k]> } =  $state({});

  let contractFrom: Contract = $state(new ContractBuilder('HypERC20Collateral'));
  const optsContractFrom = $derived(allOptsFrom[contractFromTab]);
  let errorsContractFrom : { [k in KindFrom]?: OptionsErrorMessages } =  $state({});

  $effect(() => {
    if (optsContractFrom) {
      try {
        // contractFrom = buildContractGeneric(optsContractFrom) as Contract;


        errorsContractFrom[contractFromTab] = undefined;
      } catch (e: unknown) {
        if (e instanceof OptionsError) {
          errorsContractFrom[contractFromTab] = e.messages;
        } else {
        throw e;
        }
      }
    }
  });

  let contactFromPrimaryStandard:  string = $state('ERC20')

  $effect(() => {
    if (initialContractFromTab) {
      contactFromPrimaryStandard = contractFromLists.find(contract => contract.name === initialContractFromTab)?.primaryToken ?? ''
      initialContractPrimaryTokenFromTab = contactFromPrimaryStandard
    }
  })

  let contractToLists = [
    {
      name: 'HypERC20',
      label: 'HypERC20.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'None'
    },
    {
      name: 'FastHypERC20',
      label: 'FastHypERC20.sol',
      route: 'Collateral to Synthetic',
      primaryToken: 'None'
    },
    {
      name: 'HypXERC20Lockbox',
      label: 'HypXERC20Lockbox.sol',
      route: 'xERC20 Routes',
      primaryToken: 'xERC20Lockbox'
    },
    {
      name: 'HypXERC20',
      label: 'HypXERC20.sol',
      route: 'xERC20 Routes',
      primaryToken: 'xERC20'
    },
  ]

  let contractToListsFiltered = $derived(
    contractToLists.filter(contract => contract.route === warpRouteState.route)
  )

  let initialContractToTab: string | undefined = $state(undefined);
  let contractToTab : KindTo = $derived(sanitizeKindTo(initialContractToTab));
  let allOptsTo: { [k in KindTo]?: Required<KindedToOptions [k]> } =  $state({});

  let contractTo: Contract = $state(new ContractBuilder('HypERC20'));
  const optsContractTo = $derived(allOptsTo[contractToTab]);
  let errorsContractTo : { [k in KindTo]?: OptionsErrorMessages } =  $state({});

  $effect(() => {
    if (optsContractTo) {
      try {
        // contractTo = buildContractGeneric(optsContractTo) as Contract;

        errorsContractTo[contractToTab] = undefined;
      } catch (e: unknown) {
        if (e instanceof OptionsError) {
          errorsContractTo[contractToTab] = e.messages;
        } else {
        throw e;
        }
      }
    }
  });

  let contactToPrimaryStandard:  string = $state('xERC20Lockbox')

  $effect(() => {
    if (initialContractToTab) {
      contactToPrimaryStandard = contractToLists.find(contract => contract.name === initialContractToTab)?.primaryToken ?? ''
      initialContractPrimaryTokenToTab = contactToPrimaryStandard
    }
  })

  function selectRoute(warpRoute: WarpRoute) {
    warpRouteState.state = 'SettingTokens';
    warpRouteState.route = warpRoute.route;

  }

  let openDropdownFrom: boolean = $state(false)
  function selectTokenFrom(contractName: string) {
    openDropdownFrom = false
  }

  let openDropdownTo: boolean = $state(false)
  function selectTokenTo(contractName: string) {
    openDropdownTo = false
  }

  function comfirmStep1( primaryFromToken: string, primaryToToken: string ) {
    warpRouteState.state = 'DeployingPrimaryToken'
  }

</script>

<section class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-4 lg:py-10">
      
  <div class="flex flex-col gap-10 lg:gap-7 items-center justify-center text-center lg:text-left lg:items-start">
    <h1 class="font-bold text-3xl lg:text-5xl tracking-tight md:-mb-4 bg-gradient-to-r from-red-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
        Let Build Your Own Bridge!
    </h1>
  </div>

</section>

<div class="m-8">
  <a
    href="/"
    class="link !no-underline text-base-content/80 hover:text-base-content inline-flex items-center gap-1"
    title="Back to Homee"
  >
    <AbstractIcon name={icons.ArrowBack.name} width="20" height="20" />
    Back to Home
  </a>
</div>

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[0].pathname}>
    <div class="divider divider-primary ">
      <h1 class="btn btn-accent text-2xl">Step 1 : Select Routes</h1>
    </div>
  </section>
</Background>

<div class="container flex flex-col gap-4 p-8 mx-8">

  {#if warpRouteState.state === 'SettingUproute' || 'SettingTokens'}

    <legend class="fieldset-legend font-bold text-xl">Routes:</legend>
    <fieldset class="fieldset">

      <select class="select select-md"
        bind:value={warpRouteState.route}
        onchange={() => selectRoute(warpRouteState)}
      >
        <option disabled selected>Pick a route</option>
        <option>Collateral to Synthetic</option>
        <option>xERC20 Routes</option>
      </select>

    </fieldset>

  {/if}

  {#if warpRouteState.state === 'SettingTokens' }

    <h2 class="font-bold text-xl">
      Select Contract Features:
    </h2>

    <div class="flex flex-row justify-between grow gap-4">

      <div class="flex flex-col gap-4">

        <div class="font-bold text-xl bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >
          On origin chain::
        </div>

        <details class="dropdown dropdown-right" bind:open={openDropdownFrom}>
          <summary class="btn m-1" >
            {initialContractFromTab}
            <AbstractIcon name={icons.MenuDown.name} width="24" height="24" />
          </summary>
            <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    
              {#each contractFromListsFiltered as contract}
                <li>
                  <button onclick={() => selectTokenFrom(contract.name)}>
                    {contract.label}
                  </button>
                </li>
              {/each}
          </ul>
        </details>

      </div>

      <div class="flex flex-col gap-4">

        <div class="font-bold text-xl bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >
          On destination chain:
        </div>

        <details class="dropdown dropdown-left" bind:open={openDropdownTo}>
          <summary class="btn m-1">
            <AbstractIcon name={icons.MenuDown.name} width="24" height="24" />
            {initialContractToTab}
          </summary>
    
          <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    
            {#each contractToListsFiltered as contract}
              <li>
                <button onclick={() => selectTokenTo(contract.name)}>
                  {contract.label}
                </button>
              </li>
            {/each}
          </ul>
        </details>
      </div>
    
    </div>

    <div class="flex flex-row justify-end items-center gap-x-16 ">
      <h3 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Your Routes: </div>
      </h3>

      <h3 class="font-semibold text-xl">
        {initialContractFromTab}
      </h3>

      <h3 class="font-semibold text-xl">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >To</div>
      </h3>

      <h3 class="font-semibold text-xl">
        {initialContractToTab}
      </h3>

      <Button
          variant="default"
          class="button block"
          type="submit"
          onclick={() => comfirmStep1(contactFromPrimaryStandard, contactToPrimaryStandard)}
      >
         Confirm this Route
      </Button>
    </div>
  
  {/if}

</div>