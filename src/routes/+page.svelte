<script lang="ts">
    import { onMount } from 'svelte';
    import type { Card } from '@prisma/client';
    import CardComponent from '$lib/components/CardComponent.svelte';
    import ColumnComponent from '$lib/components/ColumnComponent.svelte';
    import CreateCardComponent from '$lib/components/CreateCardComponent.svelte';
    import { cardService } from '$lib/services/cardService';
    
    let cards: Card[] = [];
    let error = '';
    let isLoading = false;
    let isModalOpen = false;

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

    async function createCard(data: { title: string; description?: string; status?: string }) {
        const newCard = await cardService.create(data);
        cards = [newCard, ...cards];
    }

    async function updateCard(id: number, data: { title: string; description?: string; status?: string }) {
        try {
            const updatedCard = await cardService.update(id, data);
            cards = cards.map(c => c.id === id ? updatedCard : c);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to update card';
        }
    }

    async function updateCardStatus(id: number, newStatus: string) {
        try {
            const updatedCard = await cardService.update(id, { status: newStatus });
            cards = cards.map(c => c.id === id ? updatedCard : c);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to update card status';
            await fetchCards();
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
    <div class="header">
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#B89230"><path d="M480-80q-85 0-158-30.5T195-195q-54-54-84.5-127T80-480q0-84 30.5-157T195-764q54-54 127-85t158-31q75 0 140 24t117 66l-43 43q-44-35-98-54t-116-19q-145 0-242.5 97.5T140-480q0 145 97.5 242.5T480-140q145 0 242.5-97.5T820-480q0-30-4.5-58.5T802-594l46-46q16 37 24 77t8 83q0 85-31 158t-85 127q-54 54-127 84.5T480-80Zm-59-218L256-464l45-45 120 120 414-414 46 45-460 460Z"/></svg>
        <h1>Todo Board</h1>
        <button class="create-btn" on:click={() => isModalOpen = true}>
            + New Task
        </button>
    </div>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    <CreateCardComponent 
        isOpen={isModalOpen} 
        onCreate={createCard} 
        onClose={() => isModalOpen = false} 
    />

    {#if isLoading}
        <p>Loading...</p>
    {:else}
        <section class="cards-section">
            <h2>All Cards</h2>
            <div class="cards-grid">
                {#each cards as card (card.id)}
                    <CardComponent {card} onUpdate={updateCard} onDelete={deleteCard} />
                {:else}
                    <p>No cards yet. Click "New Task" to get started!</p>
                {/each}
            </div>
        </section>

        <section class="board-section">
            <h2>Kanban Board</h2>
            <ColumnComponent {cards} onUpdateStatus={updateCardStatus} />
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

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    h1 {
        margin: 0;
        font-size: 2.5rem;
    }

    .create-btn {
        padding: 12px 24px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
    }

    .create-btn:hover {
        background: #5568d3;
        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
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

    .error {
        color: #c33;
        background: #fee;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    @media (max-width: 968px) {
        .header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .cards-grid {
            grid-template-columns: 1fr;
        }
    }
</style>