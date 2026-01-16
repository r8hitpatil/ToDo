<script lang="ts">
    import type { Card } from '@prisma/client';

    export let cards: Card[];
    export let status: 'todo' | 'doing' | 'done';
    export let title: string;

    $: filteredCards = cards.filter(card => card.status === status);
</script>

<li class="column">
    <h2>{title}</h2>
    {#if filteredCards.length > 0}
        <ul class="cards">
            {#each filteredCards as card (card.id)}
                <li class="card">
                    {card.title}
                </li>
            {/each}
        </ul>
    {:else}
        <p class="empty">No Cards...</p>
    {/if}
</li>

<style>
    .column {
        min-width: 300px;
        padding: 1rem;
        background-color: #f8f9fa;
        border-radius: 12px;
        list-style: none;
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
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
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
</style>