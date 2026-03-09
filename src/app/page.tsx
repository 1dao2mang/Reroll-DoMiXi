'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import RollReel from '@/components/RollReel';
import { Item } from '@/lib/data';
import { addToCollection } from '@/lib/collection';
import './page.css';

export default function Home() {
  const [isRolling, setIsRolling] = useState(false);
  const [triggerReset, setTriggerReset] = useState(false);
  const [wonItem, setWonItem] = useState<Item | null>(null);
  const [dynamicItems, setDynamicItems] = useState<Item[]>([]);

  React.useEffect(() => {
    fetch('/api/player4me/videos')
      .then(res => res.json())
      .then(data => {
         const list = data.data || data.videos || data;
         if (Array.isArray(list) && list.length > 0) {
             const items: Item[] = list.map((v: any, idx: number) => ({
                 id: `vid-${v.id || idx}`,
                 name: v.title || v.name || `Asset #${idx + 1}`,
                 rarity: ['legendary', 'mythical', 'exceed', 'rare'][Math.floor(Math.random() * 4)] as any,
                 type: 'video',
                 iframe: `https://reroll_domixi.4meplayer.com/#${v.id}`, // Custom embed URL with hash
                 image: v.poster ? (v.poster.startsWith('http') ? v.poster : (v.assetUrl || 'https://asset.player4me.ink') + v.poster) : undefined
             }));
             setDynamicItems(items);
         }
      })
      .catch((err: any) => console.error('Failed to fetch assets', err));
  }, []);

  const startRoll = () => {
    if (isRolling) return;
    setWonItem(null);
    setTriggerReset(prev => !prev);
    // Slight delay to ensure DOM resets the reel position before applying transition
    setTimeout(() => {
        setIsRolling(true);
    }, 50);
  };

  const handleRollComplete = (winner: Item) => {
    setIsRolling(false);
    setWonItem(winner);
    // Push the newly acquired item to the global collection
    addToCollection(winner);
  };

  return (
    <div className="layout-root">
      {/* HEADER Nav */}
      <Navbar />

      {/* MAIN CENTER STAGE */}
      <main className="main-stage container">
        
        <div className="hero-section">
            <h1 className="hero-title">Media Randomizer</h1>
            <p className="hero-subtitle">Retrieve a random asset from the cloud ecosystem.</p>
        </div>

        <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <RollReel 
                isRolling={isRolling} 
                onRollComplete={handleRollComplete} 
                triggerReset={triggerReset}
                dynamicItems={dynamicItems}
            />
        </section>

        {/* CONTROLS */}
        <section className="gacha-controls">
            <button 
                className="pull-btn" 
                onClick={startRoll}
                disabled={isRolling}
            >
                {isRolling ? 'Retrieving...' : 'Pull 1x (500 Credits)'}
            </button>
        </section>

        {/* WINNER POPUP */}
        {wonItem && (
            <div className="winner-overlay">
                <div className="winner-content">
                    <span className="winner-badge">Extraction Complete</span>
                    
                    <div className={`winner-card-showcase rarity-${wonItem.rarity}`}>
                        {wonItem.type === 'video' && wonItem.iframe ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <iframe 
                                    className="winner-media" 
                                    src={`${wonItem.iframe}&auto=1&autoplay=1`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0" 
                                    allow="autoplay; fullscreen"
                                    allowFullScreen
                                />
                                {/* Optional: A transparent overlay if pointerEvents isn't enough, but pointer-events: none usually stops all clicks */}
                            </div>
                        ) : (
                            <img className="winner-media" src={wonItem.image} alt={wonItem.name} />
                        )}
                        <div className="winner-details" style={{ display: 'none' }}>
                            <h3 className="winner-name">{wonItem.name}</h3>
                            <span className={`winner-rarity-label rarity-text-${wonItem.rarity}`}>{wonItem.rarity}</span>
                        </div>
                    </div>
                    
                    <button className="btn-secondary" onClick={() => setWonItem(null)} style={{ background: 'var(--bg-elevated)', border: 'none' }}>
                        Close Window
                    </button>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
