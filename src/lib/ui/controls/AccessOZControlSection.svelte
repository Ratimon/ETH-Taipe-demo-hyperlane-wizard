<script lang="ts">
    import type { AccessOZ } from '$lib/wizard/smart-contracts';

    import ToggleRadio from '../inputs/ToggleRadio.svelte';
    import HelpTooltip from './HelpTooltip.svelte';

    type Props = {
        access: AccessOZ;
        required: boolean;
    };

    let {
        access = $bindable(),
        required = $bindable(),
    }: Props = $props();

    let defaultValueWhenEnabled: false | "ownable" | "roles" | "managed" = $state('ownable');

    let wasRequired = $state(required);
    let wasAccess = $state(access);

    $effect(() => {
        if (wasRequired && !required) {
            access = wasAccess;
        } else {
            wasAccess = access;
        if (access === false && required) {
            access = defaultValueWhenEnabled;
        }
        }

        wasRequired = required;
        
        if (access !== false) {
            defaultValueWhenEnabled = access;
        }
    });

</script>

<section class="controls-section">
    <h1>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="flex items-center tooltip-container pr-2">
        <span>Access Control</span>
        <span class="ml-1">
            <ToggleRadio bind:value={access} checked={access !== false} defaultValue="ownable" disabled={required} />
        </span>
        <HelpTooltip placement="right" align="right" link="https://github.com/Vectorized/solady/tree/main/src/auth">
            Restrict who can access the functions of a contract or when they can do it.
        </HelpTooltip>
        </label>
    </h1>

    <div class="checkbox-group">
        <label class:checked={access === 'ownable'}>
            <input type="radio" bind:group={access} value="ownable">
            Ownable
            <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/access#Ownable">
                Simple mechanism with a single account authorized for all privileged actions.
            </HelpTooltip>
            </label>
        <label class:checked={access === 'roles'}>
            <input type="radio" bind:group={access} value="roles">
            Roles
            <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/access#AccessControl">
                Flexible mechanism with a separate role for each privileged action. A role can have many authorized accounts.
            </HelpTooltip>
        </label>

        <label class:checked={access === 'managed'}>
            <input type="radio" bind:group={access} value="managed">
            Managed
            <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/access#AccessManaged">
              Enables a central contract to define a policy that allows certain callers to access certain functions.
            </HelpTooltip>
          </label>
    </div>
</section>