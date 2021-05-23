<script>
import SvelteMarkdown from 'svelte-markdown';
import { popTask, getTaskId } from '../store';

export let task;

let target;
let editMode = !task.description;

const drag = (event) => {
    event.dataTransfer.setData("text/plain", getTaskId(task));
}

let removeTaskConfirm = false;

function removeTask() {
    console.dir(popTask(getTaskId(task)));
    removeTaskConfirm = false;
}

function isDark(task) {
    const brightness = Math.round((
        parseInt(task.color.slice(1, 3), 16) * 299 +
        parseInt(task.color.slice(3, 5), 16) * 587 +
        parseInt(task.color.slice(5, 7), 16) * 114
    ) / 1000);
    return brightness <= 125;
}
</script>

<div bind:this={target} class="card draggable shadow-sm" style="background-color:{task.color}" draggable="true" on:dragstart={drag}>
    <div class="card-body p-2 clearfix">
        {#if editMode}
            <input type="color" class="form-control" bind:value={task.color}>
        {/if}
        <div class="card-title {isDark(task) ? 'text-white' : ''}">
            {#if editMode}
                <input type="text" class="form-control" bind:value={task.title}>
            {:else}
                <strong>{task.title}</strong>
            {/if}
        </div>
        <div class="{isDark(task) ? 'text-white' : ''}">
            {#if editMode}
                <textarea class="form-control" bind:value={task.description}></textarea>
            {:else if task.description}
                <SvelteMarkdown source={task.description}/>
            {/if}
        </div>
        {#if removeTaskConfirm}
            Remove this task?
            <button type="button" class="btn btn-secondary btn-sm pull-right" on:click={()=> {removeTaskConfirm = false;}}>
                No
            </button>
            <button type="button" class="btn btn-danger btn-sm pull-right" on:click={removeTask}>
                Yes
            </button>
        {:else}
            <button type="button" class="btn btn-primary btn-sm" on:click={()=> {editMode = !editMode;}}>
                {editMode?'View':'Edit'}
            </button>
            <button type="button" class="btn btn-secondary btn-sm pull-right" on:click={()=> {removeTaskConfirm = true;}}>
                Remove
            </button>
        {/if}
    </div>
</div>
