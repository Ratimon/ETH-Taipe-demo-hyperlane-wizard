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
  import ScrollStep from '$lib/ui/components/ScrollStep.svelte';
  import Button from '$lib/ui/buttons/Button.svelte';
  import Background from '$lib/ui/layouts/Background.svelte';
  import WizardSingle from '$lib/ui/components/WizardSingle.svelte';
  import OverflowMenu from '$lib/ui/components/OverflowMenu.svelte';

  import ERC20ContractControls from '$lib/ui/controls/ERC20ContractControls.svelte';
  import ERC4626ContractControls from '$lib/ui/controls/ERC4626ContractControls.svelte';
  import XERC20ContractControls from '$lib/ui/controls/XERC20ContractControls.svelte';
  import XERC20LockboxContractControls from '$lib/ui/controls/XERC20LockboxContractControls.svelte';

  type Props = {
      data: PageData;
  } & PageData;

  let { data }: Props = $props();

  const stepLinks : Link[] = [
      {pathname: '#1-select-routes', title: 'Select Routes', navType: 'scroll' },
      {pathname: '#2-primary', title: 'Deploy dependency contract', navType: 'scroll' },
  ];

  type Route = 'Pick a route'
    | 'Collateral to Synthetic'
    | 'xERC20 Routes';
  type RouteState = 'SettingUproute'
    | 'SettingTokens'
    | 'DeployingPrimaryToken'
    | 'DeployingRoutes'

    type WarpRoute = {
    state: RouteState;
    route: Route;
    tokenFromAddress: string;
    tokenToAddress: string;
    // error?: unknown;
  };

  const warpRouteState: WarpRoute = $state({
    state: 'SettingUproute',
    route: 'Pick a route',
    tokenFromAddress: '0x',
    tokenToAddress: '0x',
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
        contractFrom = buildContractGeneric(optsContractFrom) as Contract;


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
        contractTo = buildContractGeneric(optsContractTo) as Contract;

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

    if (warpRoute.route === 'Collateral to Synthetic') {
      initialContractFromTab = 'HypERC20Collateral'
      initialContractToTab = 'HypERC20'
      initialContractPrimaryTokenFromTab = 'ERC20'

    } else if (warpRoute.route === 'xERC20 Routes') {
      initialContractFromTab = 'HypXERC20Lockbox'
      initialContractToTab = 'HypXERC20Lockbox'
      initialContractPrimaryTokenFromTab = 'XERC20Lockbox'
      initialContractPrimaryTokenToTab = 'XERC20Lockbox'
    }
  }

  let openDropdownFrom: boolean = $state(false)
  function selectTokenFrom(contractName: string) {
    initialContractFromTab = contractName
    openDropdownFrom = false
  }

  let openDropdownTo: boolean = $state(false)
  function selectTokenTo(contractName: string) {
    initialContractToTab = contractName
    openDropdownTo = false
  }

  function comfirmStep1( primaryFromToken: string, primaryToToken: string ) {
    warpRouteState.state = 'DeployingPrimaryToken'
    initialContractPrimaryTokenFromTab = primaryFromToken;
    initialContractPrimaryTokenToTab = primaryToToken;
  }

  let isPrimaryTokenFromDeployed: boolean = $state(true);

  function togglePrimaryTokenFromDeployed( ) {
    isPrimaryTokenFromDeployed = !isPrimaryTokenFromDeployed
  }

  let isPrimaryTokenToDeployed: boolean = $state(true);

  function togglePrimaryTokenToDeployed( ) {
    isPrimaryTokenToDeployed = !isPrimaryTokenToDeployed
  }

  function areAddressesFilled( ) {
    if (warpRouteState.route === 'Collateral to Synthetic') {
      return warpRouteState.tokenFromAddress !== '0x'
    }
    if (warpRouteState.route === 'xERC20 Routes') {
      return warpRouteState.tokenFromAddress !== '0x' && warpRouteState.tokenToAddress !== '0x'
    }
    return false
  }

  function comfirmStep2() {
    if (areAddressesFilled()) {
      warpRouteState.state = 'DeployingRoutes'
    }
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
    title="Back to Home"
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

  {#if warpRouteState.state === 'SettingUproute' || 'SettingTokens' || 'DeployingPrimaryToken'}

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

  {#if warpRouteState.state === 'SettingTokens' || warpRouteState.state === 'DeployingPrimaryToken' }

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

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[1].pathname}>
    <div class="divider divider-primary ">
      <h1 class={`btn ${warpRouteState.state !== 'DeployingPrimaryToken' ? 'btn-disabled' : 'btn-accent'} text-2xl `}>
        Step 2 : Deploy dependency contract
      </h1>
    </div>
  </section>
</Background>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[1].title} />


{#if warpRouteState.state == 'SettingUproute' || warpRouteState.state == 'SettingTokens'}
  <div class="container flex flex-row justify-center items-center p-8 mx-8 ">
    <p class="font-bold text-xl">
      Complete step One first!
    </p>
  </div>
{:else}
  <div class="container flex flex-col items-center justify-center gap-y-8 p-8 mx-8">
    <!-- Source Chain -->
    {#if contactFromPrimaryStandard === 'None'}
      <h2 class="font-semibold text-xl">
        No Address required at <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Source Chain: </div>
      </h2>
    {:else}
      <h2 class="font-semibold text-xl">
        Address required at <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Source Chain: </div>
      </h2>

      <div class="flex flex-row items-center gap-x-8 mx-8">
      
        <h3 class="font-semibold text-xl">
          The standard being deployed is:
        </h3>
    
        <h3 class="font-semibold text-lg">
          {contactFromPrimaryStandard}
        </h3>
    
        <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-80">
          <legend class="fieldset-legend font-bold">
            Have Not Deployed Yet? Uncheck below to start modifying!!
          </legend>
          <label class="fieldset-label">
            <input type="checkbox" checked={isPrimaryTokenFromDeployed} class="checkbox" onclick={togglePrimaryTokenFromDeployed} />
            A contract at source chain already deployed
          </label>
        </fieldset>

        <label class="input input-primary input-xl validator">
          <!-- <legend class="fieldset-legend">Put required address here</legend> -->
          <input bind:value={warpRouteState.tokenFromAddress} placeholder="Put required address here e.g. 0x.." type="text" required  minlength="42" pattern="/^0x[a-fA-F0-9]{40}$/" title="Must be a valid Ethereum address" />
        </label>
        <p class="validator-hint hidden">
          Must be in the format of 0x followed by 40 characters
        </p>
          
      </div>
      
      {#if !isPrimaryTokenFromDeployed}
        <WizardSingle initialContractTab={initialContractPrimaryTokenFromTab} contractTab={contractPrimaryTokenFromTab} opts={optsPrimaryTokenFrom} contractInstance={contractPrimaryTokenFrom}>
          {#snippet menu()}
            <div class="tab overflow-hidden">
              <Background color="bg-base-200">
                <OverflowMenu>
                  {#if contractPrimaryTokenFromTab === 'ERC20'}
                    <button class:selected={contractPrimaryTokenFromTab === 'ERC20'} onclick={() => initialContractPrimaryTokenFromTab = 'ERC20'}>
                      ERC20
                    </button>
                  {/if}
                  {#if contractPrimaryTokenFromTab === 'ERC4626'}
                    <button class:selected={contractPrimaryTokenFromTab === 'ERC4626'} onclick={() => initialContractPrimaryTokenFromTab = 'ERC4626'}>
                      ERC4626
                    </button>
                  {/if}
                  {#if contractPrimaryTokenFromTab === 'XERC20'}
                    <button class:selected={contractPrimaryTokenFromTab === 'XERC20'} onclick={() => initialContractPrimaryTokenFromTab = 'XERC20'}>
                      XERC20
                    </button>
                  {/if}
                  {#if contractPrimaryTokenFromTab === 'XERC20Lockbox'}
                    <button class:selected={contractPrimaryTokenFromTab === 'XERC20Lockbox'} onclick={() => initialContractPrimaryTokenFromTab = 'XERC20Lockbox'}>
                      XERC20Lockbox
                    </button>
                  {/if}
                </OverflowMenu>
              </Background>
            </div>
          {/snippet}
        
          {#snippet control()}
            <div class="controls w-64 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
    
              {#if contractPrimaryTokenFromTab === 'ERC20'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'ERC20'}>
                  <ERC20ContractControls bind:opts={allOptsPrimaryTokenFrom.ERC20!}/>
                </div>
              {/if}
              {#if contractPrimaryTokenFromTab === 'ERC4626'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'ERC4626'}>
                  <ERC4626ContractControls bind:opts={allOptsPrimaryTokenFrom.ERC4626!}/>
                </div>
              {/if}
              {#if contractPrimaryTokenFromTab === 'XERC20'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'XERC20'}>
                  <XERC20ContractControls bind:opts={allOptsPrimaryTokenFrom.XERC20!}/>
                </div>
              {/if}
              {#if contractPrimaryTokenFromTab === 'XERC20Lockbox'}
                <div class:hidden={contractPrimaryTokenFromTab !== 'XERC20Lockbox'}>
                  <XERC20LockboxContractControls bind:opts={allOptsPrimaryTokenFrom.XERC20Lockbox!}/>
                </div>
              {/if}
              
            </div>
          {/snippet}
        
        </WizardSingle>
    
      {/if}
    {/if}

    <!-- Destination Chain -->
    {#if contactToPrimaryStandard === 'None'}
      <h2 class="font-semibold text-xl">
        No Address required at<div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Destination Chain: </div>
      </h2>
    {:else}
      <h2 class="font-semibold text-xl">
        Address required at<div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >Destination Chain: </div>
      </h2>

      <div class="flex flex-row items-center gap-x-16 mx-8">
      
        <h3 class="font-semibold text-xl">
          The standard being deployed is:
        </h3>
    
        <h3 class="font-semibold text-lg">
          {contactToPrimaryStandard}
        </h3>
    
        <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-80">
          <legend class="fieldset-legend font-bold">
            Have Not Deployed Yet? Uncheck below to start modifying!!
          </legend>
          <label class="fieldset-label">
            <input type="checkbox" checked={isPrimaryTokenToDeployed} class="checkbox" onclick={togglePrimaryTokenToDeployed} />
            A contract at destimation chain already deployed
          </label>
        </fieldset>

        <label class="input input-primary input-xl validator">
          <!-- <legend class="fieldset-legend">Put required address here</legend> -->
          <input bind:value={warpRouteState.tokenToAddress} placeholder="Put required address here e.g. 0x.." type="text" required  minlength="42" pattern="/^0x[a-fA-F0-9]{40}$/" title="Must be a valid Ethereum address" />
        </label>
        <p class="validator-hint hidden">
          Must be in the format of 0x followed by 40 characters
        </p>
          
      </div>

      {#if !isPrimaryTokenToDeployed}
        <WizardSingle initialContractTab={initialContractPrimaryTokenToTab} contractTab={contractPrimaryTokenToTab} opts={optsPrimaryTokenTo} contractInstance={contractPrimaryTokenTo}>
          {#snippet menu()}
            <div class="tab overflow-hidden">
              <Background color="bg-base-200">
                <OverflowMenu>
                  {#if contractPrimaryTokenToTab === 'XERC20'}
                    <button class:selected={contractPrimaryTokenToTab === 'XERC20'} onclick={() => initialContractPrimaryTokenToTab = 'XERC20'}>
                      XERC20
                    </button>
                  {/if}
                  {#if contractPrimaryTokenToTab === 'XERC20Lockbox'}
                    <button class:selected={contractPrimaryTokenToTab === 'XERC20Lockbox'} onclick={() => initialContractPrimaryTokenToTab = 'XERC20Lockbox'}>
                      XERC20Lockbox
                    </button>
                  {/if}
                </OverflowMenu>
              </Background>
            </div>
          {/snippet}
        
          {#snippet control()}
            <div class="controls w-64 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
    
              {#if contractPrimaryTokenToTab === 'XERC20'}
                <div class:hidden={contractPrimaryTokenToTab !== 'XERC20'}>
                  <XERC20ContractControls bind:opts={allOptsPrimaryTokenTo.XERC20!}/>
                </div>
              {/if}

              {#if contractPrimaryTokenToTab === 'XERC20Lockbox'}
                <div class:hidden={contractPrimaryTokenToTab !== 'XERC20Lockbox'}>
                  <XERC20LockboxContractControls bind:opts={allOptsPrimaryTokenTo.XERC20Lockbox!}/>
                </div>
              {/if}
              
            </div>
          {/snippet}
        </WizardSingle>
    
      {/if}

    {/if}

    <div class="w-full flex flex-row justify-end">
      <Button
          disabled={!areAddressesFilled()}
          variant="default"
          type="submit"
          onclick={comfirmStep2}
      >

          Confirm the Addresses
      </Button>
    </div>

  </div>

{/if}