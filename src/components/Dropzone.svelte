<script>
import { json, popTask, getTaskIndex } from '../store';
export let index;
export let tasks;

let target;

export const allowDrop = (ev) => {
    ev.preventDefault();
    target.classList.add('droppable');
};

export const clearDrop = () => {
    target.classList.remove('droppable');
};

export const drop = (event) => {
    event.preventDefault();
    let id = event.dataTransfer.getData("text/plain");
    let previousIndex = getTaskIndex(id, tasks);
    let task = popTask(id);
    console.log('%s = %o', id, task);
    if (task) {
        tasks.splice(previousIndex > -1 && previousIndex <= index ? index - 1 : index, 0, task);
        json.update(x => x);
    }
    clearDrop();
};
</script>

<div bind:this={target} class="dropzone rounded" on:drop={drop} on:dragover={allowDrop} on:dragleave={clearDrop}> &nbsp; </div>
