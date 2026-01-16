import type { Card } from '@prisma/client';
import type { CardsResponse, CardResponse } from '$lib/types/api.types';

export const cardService = {
    async getAll(): Promise<Card[]> {
        const res = await fetch('/api/cards');
        const data: CardsResponse = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data.data || [];
    },

    async create(cardData: { title: string; description?: string; status?: string }): Promise<Card> {
        const res = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardData)
        });

        const data: CardResponse = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (!data.data) {
            throw new Error('No data returned');
        }
        
        return data.data;
    },

    async update(id: number, updates: { title?: string; description?: string; status?: string }): Promise<Card> {
        const res = await fetch(`/api/cards/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const data: CardResponse = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (!data.data) {
            throw new Error('No data returned');
        }
        
        return data.data;
    },

    async delete(id: number): Promise<void> {
        const res = await fetch(`/api/cards/${id}`, {
            method: 'DELETE'
        });

        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
    }
};