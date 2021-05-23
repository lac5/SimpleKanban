<script>
import SvelteMarkdown from 'svelte-markdown';
import Alert from './Alert.svelte';
import Board from './Board.svelte';
import { json } from '../store';

let editMode = false;

function swapBoard(from, to) {
    let temp = $json.data[from];
    $json.data[from] = $json.data[to];
    $json.data[to] = temp;
    json.update(x => x);
}

function newBoard(toLeft) {
    let board = {
        board: 'New Board',
        tasks: [],
    };
    if (toLeft) {
        $json.data.unshift(board);
    } else {
        $json.data.push(board);
    }
    json.update(x => x);
}

let removeBoardConfirm = null;

function removeBoard() {
    if (removeBoardConfirm) {
        $json.data.splice(removeBoardConfirm.index, 1);
        if ($json.data.length === 0) {
            newBoard(true);
        } else {
            json.update(x => x);
        }
        removeBoardConfirm = null;
    }
}
</script>

<svelte:head>
    <title>{$json.meta.title}</title>
</svelte:head>

{#if $json}
<Alert show={!!removeBoardConfirm}
    title='Remove board "{removeBoardConfirm?.board.board}"?'
    actions={[{
        display: 'Remove',
        btnClass: 'danger',
        action: removeBoard,
    }]}/>

<div class="container-fluid pt-3">
    <h3 class="font-weight-light clearfix">
        <button type="button" class="btn btn-primary btn-sm pull-right" on:click={()=>{editMode = !editMode;}}>
            {editMode?'Done':'Edit'}
        </button>
        {#if editMode}
            <input type="text" class="form-control" bind:value={$json.meta.title}>
        {:else}
            {$json.meta.title}
        {/if}
    </h3>
    <div class="small">
        {#if editMode}
            <textarea class="form-control" bind:value={$json.meta.description}></textarea>
        {:else if $json.meta.description}
            <SvelteMarkdown source={$json.meta.description}/>
        {/if}
    </div>
    <div class="row flex-row flex-sm-nowrap py-3">
        {#each $json.data as board, index}
        <div class="col-sm-6 col-md-4 col-xl-3">
            <div class="card bg-light">
                <div class="card-body">
                    {#if editMode}
                        <div class="items border border-light row">
                            {#if index <= 0}
                                <div class="col-2" role="button" on:click|preventDefault={()=> newBoard(true)}>+</div>
                            {:else}
                                <div class="col-2" role="button" on:click|preventDefault={()=> swapBoard(index, index - 1)}>&lt;</div>
                            {/if}
                            <div class="col-8">
                                <input type="text"
                                    class="form-control"
                                    bind:value={board.board}>
                                <button type="button"
                                    class="btn btn-sm col-12 btn-outline-danger"
                                    on:click={()=> { removeBoardConfirm = { board, index }; }}
                                    >Remove</button>
                            </div>
                            {#if index + 1 >= $json.data.length}
                                <div class="col-2 text-right" role="button" on:click|preventDefault={()=> newBoard(false)}>+</div>
                            {:else}
                                <div class="col-2 text-right" role="button" on:click|preventDefault={()=> swapBoard(index, index + 1)}>&gt;</div>
                            {/if}
                        </div>
                    {:else}
                        <Board {...board}/>
                    {/if}
                </div>
            </div>
        </div>
        {/each}
    </div>
</div>
{/if}
