<script  lang="ts">
  import type { PageData } from "./$types";
  import type {Link } from '$lib/model/Link';

  import type { Contract } from '$lib/wizard/smart-contracts';
  import { ContractBuilder, buildContractGeneric } from '$lib/wizard/smart-contracts';

  import type { KindedAllOptions, Kind, OptionsErrorMessages } from '$lib/wizard/shared';
  import {  sanitizeKind, OptionsError } from '$lib/wizard/shared';

  import {icons} from '$data/icon';

  import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';
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


  let initialContractTab: string | undefined = $state('L2NativeSuperchainERC20');
  let contractTab: Kind = $derived(sanitizeKind(initialContractTab));
  let allOpts: { [k in Kind]?: Required<KindedAllOptions [k]> } =  $state({});

  let contract: Contract = $state(new ContractBuilder('HypERC20Collateral'));
  const opts = $derived(allOpts[contractTab]);

  let errors : { [k in Kind]?: OptionsErrorMessages } =  $state({});


  $effect(() => {
    if (opts) {
      try {
          contract = buildContractGeneric(opts);

          errors[contractTab] = undefined;
        } catch (e: unknown) {
          if (e instanceof OptionsError) {
              errors[contractTab] = e.messages;
          } else {
          throw e;
          }
        }
    }
  });

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