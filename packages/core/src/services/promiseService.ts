import { GodsPromise, PromiseCategory } from '../types/spiritual-growth';
import { StorageManager } from '../storage';

export class PromiseService {
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
  }

  // Get all promise categories
  async getCategories(): Promise<PromiseCategory[]> {
    const { getPromiseCategories } = await import('../data/gods-promises');
    return getPromiseCategories();
  }

  // Get all promises
  async getAllPromises(): Promise<GodsPromise[]> {
    const { getAllPromises } = await import('../data/gods-promises');
    const promises = getAllPromises();
    
    // Load user's claimed and favorite status
    const userData = await this.getUserPromiseData();
    
    return promises.map(promise => ({
      ...promise,
      isClaimed: userData.claimedPromises.includes(promise.id),
      isFavorite: userData.favoritePromises.includes(promise.id)
    }));
  }

  // Get promises by category
  async getPromisesByCategory(categoryId: string): Promise<GodsPromise[]> {
    const allPromises = await this.getAllPromises();
    return allPromises.filter(promise => promise.category === categoryId);
  }

  // Get a specific promise
  async getPromise(promiseId: string): Promise<GodsPromise | null> {
    const allPromises = await this.getAllPromises();
    return allPromises.find(promise => promise.id === promiseId) || null;
  }

  // Get random promise
  async getRandomPromise(): Promise<GodsPromise> {
    const { getRandomPromise } = await import('../data/gods-promises');
    const promise = getRandomPromise();
    
    // Load user's claimed and favorite status
    const userData = await this.getUserPromiseData();
    
    return {
      ...promise,
      isClaimed: userData.claimedPromises.includes(promise.id),
      isFavorite: userData.favoritePromises.includes(promise.id)
    };
  }

  // Search promises
  async searchPromises(query: string): Promise<GodsPromise[]> {
    const { searchPromises } = await import('../data/gods-promises');
    const promises = searchPromises(query);
    
    // Load user's claimed and favorite status
    const userData = await this.getUserPromiseData();
    
    return promises.map(promise => ({
      ...promise,
      isClaimed: userData.claimedPromises.includes(promise.id),
      isFavorite: userData.favoritePromises.includes(promise.id)
    }));
  }

  // Claim a promise
  async claimPromise(promiseId: string): Promise<void> {
    const userData = await this.getUserPromiseData();
    
    if (!userData.claimedPromises.includes(promiseId)) {
      userData.claimedPromises.push(promiseId);
      userData.claimedDates[promiseId] = new Date().toISOString();
      await this.storage.savePromiseData(userData);
    }
  }

  // Unclaim a promise
  async unclaimPromise(promiseId: string): Promise<void> {
    const userData = await this.getUserPromiseData();
    
    userData.claimedPromises = userData.claimedPromises.filter(id => id !== promiseId);
    delete userData.claimedDates[promiseId];
    await this.storage.savePromiseData(userData);
  }

  // Toggle favorite status
  async toggleFavorite(promiseId: string): Promise<void> {
    const userData = await this.getUserPromiseData();
    
    if (userData.favoritePromises.includes(promiseId)) {
      userData.favoritePromises = userData.favoritePromises.filter(id => id !== promiseId);
    } else {
      userData.favoritePromises.push(promiseId);
    }
    
    await this.storage.savePromiseData(userData);
  }

  // Get claimed promises
  async getClaimedPromises(): Promise<GodsPromise[]> {
    const allPromises = await this.getAllPromises();
    return allPromises.filter(promise => promise.isClaimed);
  }

  // Get favorite promises
  async getFavoritePromises(): Promise<GodsPromise[]> {
    const allPromises = await this.getAllPromises();
    return allPromises.filter(promise => promise.isFavorite);
  }

  // Get promise statistics
  async getPromiseStats(): Promise<{
    totalPromises: number;
    claimedPromises: number;
    favoritePromises: number;
    claimsByCategory: Record<string, number>;
  }> {
    const allPromises = await this.getAllPromises();
    const claimedPromises = allPromises.filter(p => p.isClaimed);
    const favoritePromises = allPromises.filter(p => p.isFavorite);
    
    const claimsByCategory: Record<string, number> = {};
    claimedPromises.forEach(promise => {
      claimsByCategory[promise.category] = (claimsByCategory[promise.category] || 0) + 1;
    });

    return {
      totalPromises: allPromises.length,
      claimedPromises: claimedPromises.length,
      favoritePromises: favoritePromises.length,
      claimsByCategory
    };
  }

  // Get user's promise data
  private async getUserPromiseData(): Promise<{
    claimedPromises: string[];
    favoritePromises: string[];
    claimedDates: Record<string, string>;
  }> {
    try {
      const data = await this.storage.getPromiseData();
      return {
        claimedPromises: data.claimedPromises || [],
        favoritePromises: data.favoritePromises || [],
        claimedDates: data.claimedDates || {}
      };
    } catch {
      return {
        claimedPromises: [],
        favoritePromises: [],
        claimedDates: {}
      };
    }
  }
}