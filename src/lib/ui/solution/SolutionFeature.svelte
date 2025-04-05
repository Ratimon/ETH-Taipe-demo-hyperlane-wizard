<script lang="ts">
    import type { Snippet } from 'svelte';

    import {icons} from '$data/icon';
    import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';
  
    type Props = {
      children: Snippet;
    };
  
    let { children }: Props = $props();
  
</script>
  
<li class="mt-2 flex items-center">
  <AbstractIcon name={icons.Correct.name} width="20" height="20" />
  {@render children?.()}
</li>
   