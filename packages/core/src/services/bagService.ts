import { BagItem, PrayerRequest, Reflection, SpiritualNote, AnswerToPrayer } from '../types/spiritual-growth';
import { StorageManager } from '../storage';

export class BagService {
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
  }

  // Get all bag items
  async getAllItems(): Promise<BagItem[]> {
    try {
      const items = await this.storage.getBagItems();
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  // Get items by type
  async getItemsByType(type: BagItem['type']): Promise<BagItem[]> {
    const allItems = await this.getAllItems();
    return allItems.filter(item => item.type === type);
  }

  // Get a specific item
  async getItem(itemId: string): Promise<BagItem | null> {
    const allItems = await this.getAllItems();
    return allItems.find(item => item.id === itemId) || null;
  }

  // Create a new bag item
  async createItem(item: Omit<BagItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<BagItem> {
    const newItem: BagItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allItems = await this.getAllItems();
    allItems.unshift(newItem);
    await this.storage.saveBagItems(allItems);
    
    return newItem;
  }

  // Update an existing item
  async updateItem(itemId: string, updates: Partial<BagItem>): Promise<BagItem | null> {
    const allItems = await this.getAllItems();
    const itemIndex = allItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return null;
    }

    const updatedItem = {
      ...allItems[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    allItems[itemIndex] = updatedItem;
    await this.storage.saveBagItems(allItems);
    
    return updatedItem;
  }

  // Delete an item
  async deleteItem(itemId: string): Promise<boolean> {
    const allItems = await this.getAllItems();
    const filteredItems = allItems.filter(item => item.id !== itemId);
    
    if (filteredItems.length === allItems.length) {
      return false; // Item not found
    }

    await this.storage.saveBagItems(filteredItems);
    return true;
  }

  // Create a prayer request
  async createPrayerRequest(data: Omit<PrayerRequest, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<PrayerRequest> {
    const prayerRequest: PrayerRequest = {
      ...data,
      type: 'prayer',
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allItems = await this.getAllItems();
    allItems.unshift(prayerRequest);
    await this.storage.saveBagItems(allItems);
    
    return prayerRequest;
  }

  // Create a reflection
  async createReflection(data: Omit<Reflection, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Reflection> {
    const reflection: Reflection = {
      ...data,
      type: 'reflection',
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allItems = await this.getAllItems();
    allItems.unshift(reflection);
    await this.storage.saveBagItems(allItems);
    
    return reflection;
  }

  // Create a spiritual note
  async createSpiritualNote(data: Omit<SpiritualNote, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<SpiritualNote> {
    const note: SpiritualNote = {
      ...data,
      type: 'note',
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allItems = await this.getAllItems();
    allItems.unshift(note);
    await this.storage.saveBagItems(allItems);
    
    return note;
  }

  // Create an answer to prayer
  async createAnswerToPrayer(data: Omit<AnswerToPrayer, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<AnswerToPrayer> {
    const answer: AnswerToPrayer = {
      ...data,
      type: 'answer',
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allItems = await this.getAllItems();
    allItems.unshift(answer);
    await this.storage.saveBagItems(allItems);
    
    return answer;
  }

  // Update prayer status
  async updatePrayerStatus(prayerId: string, status: PrayerRequest['status'], answer?: string): Promise<PrayerRequest | null> {
    const item = await this.getItem(prayerId);
    if (!item || item.type !== 'prayer') {
      return null;
    }

    const prayer = item as PrayerRequest;
    const updates: Partial<PrayerRequest> = {
      status,
      answeredDate: status === 'answered' ? new Date().toISOString() : undefined,
      answer: answer || prayer.answer
    };

    return await this.updateItem(prayerId, updates) as PrayerRequest;
  }

  // Toggle favorite status
  async toggleFavorite(itemId: string): Promise<BagItem | null> {
    const item = await this.getItem(itemId);
    if (!item) return null;

    return await this.updateItem(itemId, { isFavorite: !item.isFavorite });
  }

  // Search items
  async searchItems(query: string): Promise<BagItem[]> {
    const allItems = await this.getAllItems();
    const lowercaseQuery = query.toLowerCase();
    
    return allItems.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.content.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get items by date range
  async getItemsByDateRange(startDate: string, endDate: string): Promise<BagItem[]> {
    const allItems = await this.getAllItems();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return allItems.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= start && itemDate <= end;
    });
  }

  // Get statistics
  async getStatistics(): Promise<{
    totalItems: number;
    itemsByType: Record<string, number>;
    favoriteItems: number;
    answeredPrayers: number;
    activePrayers: number;
  }> {
    const allItems = await this.getAllItems();
    
    const itemsByType: Record<string, number> = {};
    let favoriteItems = 0;
    let answeredPrayers = 0;
    let activePrayers = 0;

    allItems.forEach(item => {
      itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;
      
      if (item.isFavorite) {
        favoriteItems++;
      }
      
      if (item.type === 'prayer') {
        const prayer = item as PrayerRequest;
        if (prayer.status === 'answered') {
          answeredPrayers++;
        } else if (prayer.status === 'praying') {
          activePrayers++;
        }
      }
    });

    return {
      totalItems: allItems.length,
      itemsByType,
      favoriteItems,
      answeredPrayers,
      activePrayers
    };
  }

  // Export all items
  async exportItems(): Promise<string> {
    const allItems = await this.getAllItems();
    return JSON.stringify({
      items: allItems,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  // Import items
  async importItems(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      if (!data.items || !Array.isArray(data.items)) {
        return false;
      }

      const allItems = await this.getAllItems();
      const importedItems = data.items.map((item: any) => ({
        ...item,
        id: this.generateId(), // Generate new IDs to avoid conflicts
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      allItems.unshift(...importedItems);
      await this.storage.saveBagItems(allItems);
      return true;
    } catch {
      return false;
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}