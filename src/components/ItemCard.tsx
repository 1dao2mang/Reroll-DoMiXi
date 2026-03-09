import React from 'react';
import { Item } from '@/lib/data';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className={`item-card rarity-${item.rarity}`}>
        <div className="card-bg">
            <img 
                src={item.image || 'https://via.placeholder.com/180x240/1a1a1a/ffffff?text=Video+Asset'} 
                alt={item.name} 
                className="item-image" 
                loading="lazy" 
            />
        </div>
        <div className="card-overlay" />
        <div className="card-info">
            <span className="item-name">{item.name}</span>
            <span className={`item-rarity rarity-text-${item.rarity}`}>{item.rarity}</span>
        </div>
    </div>
  );
}
