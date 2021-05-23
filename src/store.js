import { writable } from 'svelte/store';

let jsonData = process.env.NODE_ENV === 'production' ? null : require('./example.json');

export const json = writable(jsonData);
json.subscribe(data => {
    jsonData = data;
});

const uniqueId = () =>
    `${Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0')
    }-${Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0')
    }-${Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0')
    }-${Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0')
    }`;

const id = Symbol();

export function getTaskId(task) {
    if (!task[id]) {
        task[id] = uniqueId();
    }
    return task[id];
}

export function getTaskIndex(taskId, tasks) {
    for (let i = 0, len = tasks.length; i < len; i++) {
        if (tasks[i][id] && tasks[i][id] === taskId) {
            return i;
        }
    }
    return -1;
}

export function popTask(taskId) {
    for (let board of jsonData.data) {
        for (let i = 0, len = board.tasks.length; i < len; i++) {
            let task = board.tasks[i];
            if (task[id] && task[id] === taskId) {
                board.tasks.splice(i, 1);
                json.update(x => x);
                return task;
            }
        }
    }
}

export function uniqueTitle() {
    let n = 0;
    let defaultTitle = /^TSK-(\d+)$/i;
    for (let board of jsonData.data) {
        for (let task of board.tasks) {
            if (defaultTitle.test(task.title)) {
                let parts = task.title.split('-');
                n = Math.max(n, parseInt(parts[1])) || n;
            }
        }
    }
    return 'TSK-' + (n + 1);
}

export function newTask(task = {}) {
    task.color = task.color || '#FFFFFF';
    task.title = task.title || uniqueTitle();
    task.description = task.description || '';
    return task;
}

function defaultTasks(jsonData) {
    for (let board of jsonData.data) {
        for (let task of board.tasks) {
            newTask(task);
        }
    }
}

defaultTasks(jsonData);

window.updateJson = newJson => {
    defaultTasks(newJson);
    json.set(newJson);
};
