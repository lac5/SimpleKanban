<script>
import Card from './Card.svelte';
import Dropzone from './Dropzone.svelte';
import { json, newTask } from '../store'
export let board;
export let tasks;

function newTaskTop() {
    tasks.unshift(newTask());
    json.update(x => x);
}

function newTaskBottom() {
    tasks.push(newTask());
    json.update(x => x);
}
</script>

<h6 class="card-title text-uppercase text-truncate py-2 clearfix" role="button" on:click|preventDefault={newTaskTop}>
    {board}
    <small class="pull-right">+</small>
</h6>
<div class="items border border-light">
    {#each tasks as task, index}
    <Dropzone {index} {tasks}/>
    <Card {task}/>
    {/each}
    <Dropzone index={tasks.length} {tasks}/>
</div>
<h6 class="card-title text-uppercase text-truncate py-2 clearfix" role="button" on:click|preventDefault={newTaskBottom}>
    {board}
    <small class="pull-right">+</small>
</h6>