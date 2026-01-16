<script lang="ts">
    import { onMount } from 'svelte';
    import type { Card } from '@prisma/client';
    import CardComponent from '$lib/components/CardComponent.svelte';
    import ColumnComponent from '$lib/components/ColumnComponent.svelte';
    import { cardService } from '$lib/services/cardService';
    
    let cards: Card[] = [];
    let error = '';
    let isLoading = false;

    async function fetchCards() {
        try {
            isLoading = true;
            cards = await cardService.getAll();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load cards';
        } finally {
            isLoading = false;
        }
    }

    async function updateCard(id: number, data: { title: string; description?: string; status?: string }) {
        try {
            const updatedCard = await cardService.update(id, data);
            cards = cards.map(c => c.id === id ? updatedCard : c);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to update card';
        }
    }

    async function deleteCard(id: number) {
        try {
            await cardService.delete(id);
            cards = cards.filter(c => c.id !== id);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to delete card';
        }
    }

    onMount(() => {
        fetchCards();
    });
</script>

<div class="container">
    <h1>📋 Todo Board</h1>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    {#if isLoading}
        <p>Loading...</p>
    {:else}
        <!-- Individual Cards View (Above) -->
        <section class="cards-section">
            <h2>All Cards</h2>
            <div class="cards-grid">
                {#each cards as card (card.id)}
                    <CardComponent {card} onUpdate={updateCard} onDelete={deleteCard} />
                {:else}
                    <p>No cards yet</p>
                {/each}
            </div>
        </section>

        <!-- Column View (Below) -->
        <section class="board-section">
            <h2>Kanban Board</h2>
            <ul class="board">
                <ColumnComponent title="To Do" status="todo" {cards} />
                <ColumnComponent title="Doing" status="doing" {cards} />
                <ColumnComponent title="Done" status="done" {cards} />
            </ul>
        </section>
    {/if}
</div>

<style>
    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 2.5rem;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #333;
    }

    .cards-section {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 2px solid #e0e0e0;
    }

    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1rem;
    }

    .board-section {
        margin-top: 2rem;
    }

    .board {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 1.5rem;
    }

    .error {
        color: #c33;
        background: #fee;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    @media (max-width: 968px) {
        .cards-grid {
            grid-template-columns: 1fr;
        }

        .board {
            flex-direction: column;
        }
    }
</style>