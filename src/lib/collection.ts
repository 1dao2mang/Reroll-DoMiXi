import { Item } from './data';

const COLLECTION_KEY = 'doMiXi_collection';

export const getCollection = (): Item[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(COLLECTION_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        console.error('Failed to read collection from LocalStorage', err);
    }
    return [];
};

export const addToCollection = (item: Item): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const currentCollection = getCollection();
        
        // Prevent duplicate IDs (Optional depending on if user can get multiple of the same video)
        // For now, we'll allow multiple if they pulled it multiple times, but let's assign a unique instance ID just in case
        
        const instanceItem = {
            ...item,
            instanceId: `${item.id}-${Date.now()}`
        };

        const newCollection = [instanceItem, ...currentCollection]; // new items first
        localStorage.setItem(COLLECTION_KEY, JSON.stringify(newCollection));
        return true;
    } catch (err) {
        console.error('Failed to save to collection', err);
        return false;
    }
};

export const clearCollection = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(COLLECTION_KEY);
    }
};
