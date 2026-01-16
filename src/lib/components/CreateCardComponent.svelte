<script lang="ts">
    export let onCreate: (data: { title: string; description?: string; status?: string }) => Promise<void>;
    export let isOpen = false;
    export let onClose: () => void;

    let title = '';
    let description = '';
    let status = 'todo';
    let isLoading = false;
    let error = '';
    let titleInput: HTMLInputElement;

    async function handleSubmit() {
        if (!title.trim()) {
            error = 'Title is required';
            return;
        }

        isLoading = true;
        error = '';

        try {
            await onCreate({
                title: title.trim(),
                description: description.trim() || undefined,
                status
            });
            
            title = '';
            description = '';
            status = 'todo';
            onClose();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to create card';
        } finally {
            isLoading = false;
        }
    }

    function handleKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        } else if (e.key === 'Escape') {
            onClose();
        }
    }

    function handleBackdropClick(e: MouseEvent | KeyboardEvent) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    $: if (isOpen && titleInput) {
        setTimeout(() => titleInput?.focus(), 100);
    }
</script>

{#if isOpen}
    <div class="modal-backdrop" on:click={handleBackdropClick} role="presentation">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="modal-header">
                <h2 id="modal-title">Create New Task</h2>
                <button class="close-btn" on:click={onClose} aria-label="Close">×</button>
            </div>
            
            <form on:submit|preventDefault={handleSubmit}>
                <input
                    bind:this={titleInput}
                    type="text"
                    placeholder="Task title..."
                    bind:value={title}
                    on:keydown={handleKeyPress}
                    disabled={isLoading}
                    required
                />
                
                <textarea
                    placeholder="Description (optional)..."
                    bind:value={description}
                    on:keydown={handleKeyPress}
                    rows="3"
                    disabled={isLoading}
                ></textarea>

                <select bind:value={status} disabled={isLoading}>
                    <option value="todo">Todo</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                </select>

                {#if error}
                    <p class="error">{error}</p>
                {/if}

                <div class="form-actions">
                    <button type="button" class="btn-cancel" on:click={onClose}>Cancel</button>
                    <button type="submit" class="btn-submit" disabled={isLoading || !title.trim()}>
                        {isLoading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>

                <p class="hint">Press Ctrl + Enter to create, Esc to cancel</p>
            </form>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .modal-content {
        background: white;
        border-radius: 12px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s;
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: #999;
        line-height: 1;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .close-btn:hover {
        background: #f0f0f0;
        color: #333;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 24px;
    }

    input, textarea, select {
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.2s;
    }

    select {
        cursor: pointer;
        background: white;
    }

    input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: #667eea;
    }

    textarea {
        resize: vertical;
        min-height: 80px;
    }

    .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 8px;
    }

    .btn-cancel,
    .btn-submit {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-cancel {
        background: #f0f0f0;
        color: #666;
    }

    .btn-cancel:hover {
        background: #e0e0e0;
    }

    .btn-submit {
        background: #667eea;
        color: white;
    }

    .btn-submit:hover:not(:disabled) {
        background: #5568d3;
    }

    .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .error {
        color: #c33;
        background: #fee;
        padding: 8px 12px;
        border-radius: 6px;
        margin: 0;
        font-size: 13px;
    }

    .hint {
        margin: 0;
        font-size: 12px;
        color: #999;
        text-align: center;
    }
</style>