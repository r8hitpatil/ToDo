<script lang="ts">
    import type { Card } from '@prisma/client';
    import { draggable, dropzone } from '$lib/services/dnd';

    export let cards: Card[];
    export let onUpdateStatus: (cardId: number, newStatus: string) => void;

    const columns = [
        { status: 'todo', label: '📫 Todo' },
        { status: 'doing', label: '🔄 Doing' },
        { status: 'done', label: '✅ Done' }
    ];

    function handleDrop(column: { status: string }, cardId: string) {
        const id = parseInt(cardId);
        const card = cards.find((c) => c.id === id);
        
        if (card && card.status !== column.status) {
            onUpdateStatus(id, column.status);
        }
    }
</script>

<ul class="board">
    {#each columns as column}
        {@const columnCards = cards.filter((c) => c.status === column.status)}
        <li class="column" use:dropzone={{
            on_dropzone(card_id) {
                handleDrop(column, card_id);
            }
        }}>
            <h2>{column.label}</h2>
            {#if columnCards.length > 0}
                <ul class="cards">
                    {#each columnCards as card (card.id)}
                        <li class="card" use:draggable={card.id}>
                            {card.title}
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="empty">No Cards...</p>
            {/if}
        </li>
    {/each}
</ul>

<style>
    .board {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 1.5rem;
    }

    .column {
        min-width: 300px;
        padding: 1rem;
        background-color: #f8f9fa;
        border-radius: 12px;
        list-style: none;
        transition: outline 0.2s;
    }

    .column:global(.droppable) {
        outline: 0.1rem solid #667eea;
        outline-offset: 0.25rem;
        background-color: #e3f2fd;
    }

    h2 {
        margin: 0 0 1rem 0;
        font-size: 18px;
        font-weight: 700;
        color: #333;
        text-transform: uppercase;
    }

    .cards {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .card {
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        color: #333;
        cursor: grab;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:active {
        cursor: grabbing;
        opacity: 0.5;
    }

    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .empty {
        color: #999;
        font-style: italic;
        text-align: center;
        padding: 2rem 0;
    }

    @media (max-width: 968px) {
        .board {
            flex-direction: column;
        }
    }
</style>