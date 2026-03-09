'use client';
import React, { useState, useRef, useEffect } from 'react';
import ItemCard from './ItemCard';
import { Item, generateReelItems } from '@/lib/data';
import './RollReel.css';

interface RollReelProps {
  isRolling: boolean;
  onRollComplete: (winner: Item) => void;
  triggerReset: boolean;
  dynamicItems?: Item[];
}

export default function RollReel({ isRolling, onRollComplete, triggerReset, dynamicItems }: RollReelProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);
  const reelRef = useRef<HTMLDivElement>(null);
  
  // Card width (180px) + Gap (16px) = 196px
  const CARD_WIDTH = 196; 
  const WINNING_INDEX = 40; // The item that will win (out of 50 generated)

  useEffect(() => {
    // Initialize reel
    setItems(generateReelItems(55, dynamicItems || []));
    setOffset(0);
  }, [triggerReset, dynamicItems]);

  useEffect(() => {
    if (isRolling && reelRef.current) {
      // Calculate stopping position
      // Reel needs to move so that WINNING_INDEX is in the center.
      // Offset calculation = (Winning Index * Card width) - Center offset
      // Since wrapper is 100% width, center offset is roughly (WrapperWidth / 2) - (CardWidth / 2)
      
      const wrapperWidth = reelRef.current.parentElement?.clientWidth || 800;
      const centerPos = (wrapperWidth / 2) - (180 / 2);
      
      // Add a slight random offset inside the winning card
      const randomJitter = Math.floor(Math.random() * 160) - 80; 
      
      const finalOffset = (WINNING_INDEX * CARD_WIDTH) - centerPos + randomJitter;
      
      // Set the CSS variable indicating transition duration
      if (reelRef.current) {
        reelRef.current.style.transition = 'transform 6s cubic-bezier(0.12, 0.8, 0.1, 1)';
        reelRef.current.style.transform = `translateX(-${finalOffset}px)`;
      }

      // Timer to signify completed roll
      const timer = setTimeout(() => {
        onRollComplete(items[WINNING_INDEX]);
      }, 6200);

      return () => clearTimeout(timer);
    } else if (!isRolling && offset === 0 && reelRef.current) {
      // Reset position without transition
      reelRef.current.style.transition = 'none';
      reelRef.current.style.transform = `translateX(0px)`;
    }
  }, [isRolling, items, onRollComplete]);

  return (
    <div className="reel-container">
      <div className="reel-win-line"></div>
      
      {/* Glow effects for the frame */}
      <div className="reel-fade-left"></div>
      <div className="reel-fade-right"></div>
      
      <div className="reel-wrapper">
        <div className="reel-track" ref={reelRef}>
          {items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="reel-item-wrapper">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
