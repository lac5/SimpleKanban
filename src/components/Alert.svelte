<script>
// import { onMount } from 'svelte';
import Modal from "sv-bootstrap-modal";

export let show;
export let title;
export let actions = [];

// function onShowToggle(show) {
//   document.body.classList.toggle('model-open', show);
// }
// $: onShowToggle(show);

function close() {
  show = false;
}

// onMount(()=> {
//   onShowToggle(show);
// });
</script>

<svelte:body on:click|once={() => { show = false; }}/>

<Modal bind:open={show}>
  <div class="modal-header">
    {#if title}
      <h5 class="modal-title">{title}</h5>
    {/if}
    <button type="button" class="close" data-dismiss="modal" on:click={close}>×</button>
  </div>
  <div class="modal-body">
  <slot/>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal" on:click={close}>Close</button>
    {#each actions as { btnClass, action, display }}
      <button type="button" class="btn btn-{btnClass ?? 'primary'}" on:click={action}>{display}</button>
    {/each}
  </div>
</Modal>
