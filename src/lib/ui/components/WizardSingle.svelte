<script  lang="ts">
  import type { Snippet } from 'svelte';

  import fileSaver from 'file-saver';
  import { v4 as uuid } from 'uuid';

  import {icons} from '$data/icon';
  import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';

  import { injectHyperlinks } from '$lib/ui/utils/inject-hyperlinks';
  import {copyToClipboard} from '$lib/ui/utils/clipboard';
  import hljs  from '$lib/ui/utils/highlightjs';

  import type {  Kind,  } from '$lib/wizard/shared';
  import {  sanitizeKind, } from '$lib/wizard/shared';

  import type {  Contract } from '$lib/wizard/smart-contracts';
  import {  printContract } from '$lib/wizard/smart-contracts';

  type Props = {
    menu: Snippet;
    control: Snippet;
    contractInstance: Contract;
    opts: any;
    initialContractTab: string | undefined ;
    contractTab: Kind;
  };

  let {
    menu,
    control,
    contractInstance,
    opts,
    initialContractTab,
    contractTab = sanitizeKind(initialContractTab),
  }: Props = $props();

  let code: string = $state("");
  let highlightedCode: string | undefined = $state("");


  $effect(() => {
    contractTab = sanitizeKind(contractTab);

      code = printContract(contractInstance as Contract);
      highlightedCode = injectHyperlinks(hljs.highlight(code, {language: 'solidity'} ).value);
    });

  
  let isScriptCopied = $state(false);

  const copyHandler = async () => {
      copyToClipboard(code);
        isScriptCopied = true;

      setTimeout(() => {
        isScriptCopied = false;
      }, 1000);
  };

  const downloadNpmHandler = async () => {
      const blob = new Blob([code], { type: 'text/plain' });
      if (opts) {
        fileSaver.saveAs(blob, contractInstance.name + '.sol');
      }
  };

</script>

<!-- <div class="container flex flex-col gap-4 p-8 mx-8"> -->
<div class="container flex flex-col gap-4">
  
    <div class="pt-3 pb-4 header flex flex-row justify-between">
  
      {@render menu()}
  
      <div class="action flex flex-row gap-2 shrink-0">
        <button class="action-button min-w-[165px]" onclick={copyHandler}>
          <div class="flex justify-between">
            {#if isScriptCopied}
              <AbstractIcon name={icons.Check.name} width="24" height="24" />Copied
            {:else}
              <AbstractIcon name={icons.Copy.name} width="24" height="24" />Copy .sol Code
            {/if}
          </div>
        </button>
  
        <button class="action-button min-w-[165px]" onclick={downloadNpmHandler}>
          <div class="flex justify-between">
            <AbstractIcon name={icons.Download.name} width="24" height="24" /> Download As .sol
          </div>
        </button>
      </div>
  
    </div>
  
    <div class="flex flex-row gap-4 grow">
  
      {@render control()}
  
      <div class="output flex flex-col grow overflow-auto h-[calc(120vh-40px)]">
        <div class="badge badge-primary badge-outline badge-lg">
          Contract Code:
        </div>
        <div class="badge badge-primary badge-outline badge-lg">

          {contractInstance.name}.sol
        </div>
  
        <pre class="flex flex-col grow basis-0 overflow-auto">
          <code class="hljs grow overflow-auto p-4">
            {@html highlightedCode}
          </code>
        </pre>
  
      </div>
      
    </div>
  
</div>
      
<style lang="postcss">
  .container {
      background-color: var(--gray-1);
      border: 1px solid var(--gray-2);
      border-radius: 10px;
      min-width: 32rem;
  }

  /* .header {
      font-size: var(--text-small);
  } */

  /* .tab {
      color: var(--gray-5);
  }
  */
  .action-button, :global(.overflow-btn) {
      padding: var(--size-1) var(--size-2);
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
  }

  :global(.overflow-btn) {
      border: 0;
      background-color: transparent;
  }

  :global(.overflow-btn):hover {
      background-color: var(--gray-2);
  }


  .action-button {
      background-color: var(--gray-1);
      border: 1px solid var(--gray-3);
      color: var(--gray-6);
      cursor: pointer;

      &:hover {
      background-color: var(--gray-2);
      }

      /* &:active, &.active {
      background-color: var(--gray-2);
      }
      */

      /* &.disabled {
      color: var(--gray-4);
      } */

      :global(.icon) {
      margin-right: var(--size-1);
      }
  }

</style>