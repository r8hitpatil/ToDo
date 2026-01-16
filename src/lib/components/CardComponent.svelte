<script lang="ts">
    import type { Card } from "@prisma/client";

    export let card: Card;
    export let onUpdate: (id: number, data: { title: string; description?: string;status:string }) => void;
    export let onDelete: (id: number) => void;

    let isEditing = false;
    let editTitle = card.title;
    let editDescription = card.description || '';
    let editStatus = card.status || 'todo';

    function startEdit() {
        isEditing = true;
        editTitle = card.title;
        editDescription = card.description || '';
        editStatus = card.status || 'todo';
    }

    function cancelEdit() {
        isEditing = false;
    }

    function saveEdit() {
        if (editTitle.trim()) {
            onUpdate(card.id, {
                title: editTitle.trim(),
                description: editDescription.trim() || '',
                status: editStatus.trim() || 'todo'
            });
            isEditing = false;
        }
    }

    function handleKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter' && e.ctrlKey) {
            saveEdit();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    }
</script>

<div class="card">
    {#if isEditing}
        <input
            type="text"
            class="edit-title"
            bind:value={editTitle}
            on:keydown={handleKeyPress}
            placeholder="Task title..."
        />
        <textarea
            class="edit-description"
            bind:value={editDescription}
            on:keydown={handleKeyPress}
            placeholder="Description (optional)..."
            rows="2"
        ></textarea>

        <select class="edit-status" bind:value={editStatus}>
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
        </select>
        <div class="edit-actions">
            <button class="save-btn" on:click={saveEdit}>Save</button>
            <button class="cancel-btn" on:click={cancelEdit}>Cancel</button>
        </div>
    {:else}
        <div class="card-header">
            <h3 class="title">{card.title}</h3>
            <div class="actions">
                <button class="icon-btn" on:click={startEdit} aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#404040"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </button>
                <button class="icon-btn delete" on:click={() => onDelete(card.id)} aria-label="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff7c73"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
        </div>
        {#if card.description}
            <p class="description">{card.description}</p>
        {/if}
        <span class="status">{card.status}</span>
    {/if}
</div>

<style>
    .card {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        max-width: 400px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 8px;
    }

    .title {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        flex: 1;
    }

    .actions {
        display: flex;
        gap: 4px;
    }

    .icon-btn {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .icon-btn:hover {
        background: #f0f0f0;
    }

    .icon-btn.delete:hover {
        background: #fee;
    }

    .description {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #666;
        line-height: 1.5;
    }

    .status {
        display: inline-block;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 500;
        border-radius: 12px;
        text-transform: uppercase;
        background: #e3f2fd;
        color: #1976d2;
    }

    .edit-title,
    .edit-status,
    .edit-description {
        width: 100%;
        padding: 8px;
        border: 2px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 8px;
        font-family: inherit;
    }

    .edit-title:focus,
    .edit-description:focus {
        outline: none;
        border-color: #1976d2;
    }

    .edit-description {
        resize: vertical;
    }

    .edit-actions {
        display: flex;
        gap: 8px;
    }

    .save-btn,
    .cancel-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        font-weight: 500;
    }

    .save-btn {
        background: #1976d2;
        color: white;
    }

    .save-btn:hover {
        background: #1565c0;
    }

    .cancel-btn {
        background: #f0f0f0;
        color: #666;
    }

    .cancel-btn:hover {
        background: #e0e0e0;
    }
</style>
