export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythical' | 'legendary' | 'ancient' | 'exceed';

export interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  image?: string;
  type: 'image' | 'video';
  iframe?: string;
  instanceId?: string;
}

export const MockItems: Item[] = [
  { id: '1', name: 'Cyber Katana', rarity: 'legendary', type: 'image', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=400&q=80' },
  { id: '2', name: 'Neon Glitch Pistol', rarity: 'mythical', type: 'image', image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&q=80' },
  { id: '3', name: 'Data Shard', rarity: 'common', type: 'image', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: '4', name: 'Alloy Plating', rarity: 'common', type: 'image', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
  { id: '5', name: 'Quantum Core', rarity: 'ancient', type: 'image', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80' },
  { id: '6', name: 'Holo-Visor', rarity: 'rare', type: 'image', image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&q=80' },
  { id: '7', name: 'Scrap Metal', rarity: 'common', type: 'image', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80' },
  { id: '8', name: 'Neural Link', rarity: 'uncommon', type: 'image', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: '9', name: 'God Core', rarity: 'exceed', type: 'image', image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&q=80' },
  { id: '10', name: 'Plasma Rifle', rarity: 'rare', type: 'image', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&q=80' }
];

export const generateReelItems = (count: number = 50, sourcePool: Item[] = MockItems): Item[] => {
  const reel = [];
  const pool = sourcePool.length > 0 ? sourcePool : MockItems;
  for (let i = 0; i < count; i++) {
    // Randomize based on simple weight could be added here
    // For now, uniformly random from pool
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    reel.push({ ...randomItem, id: `${randomItem.id}-${i}` });
  }
  return reel;
};
