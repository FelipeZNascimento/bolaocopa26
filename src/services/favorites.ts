export default class FavoritesService {
  private static readonly STORAGE_KEY_PREFIX = 'favoriteUsers';

  /**
   * Add a user to favorites
   * Returns true if successfully added, false if already existed
   */
  public addFavorite(activeUserId: number, targetUserId: number): boolean {
    const favorites = this.getFavorites(activeUserId);

    if (favorites.includes(targetUserId)) {
      return false;
    }

    favorites.push(targetUserId);
    this.saveFavorites(activeUserId, favorites);
    return true;
  }

  /**
   * Clear all favorites for a specific user
   */
  public clearAllFavorites(activeUserId: number): void {
    console.log(`Clearing all favorites for user ${activeUserId}`);
    try {
      sessionStorage.removeItem(this.getStorageKey(activeUserId));
    } catch (error) {
      console.error('Error clearing favorites from sessionStorage:', error);
    }
  }

  /**
   * Get all favorite user IDs from sessionStorage for a specific user
   */
  public getFavorites(activeUserId: number): number[] {
    try {
      const stored = sessionStorage.getItem(this.getStorageKey(activeUserId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading favorites from sessionStorage:', error);
      return [];
    }
  }

  /**
   * Get the count of favorited users for a specific user
   */
  public getFavoritesCount(activeUserId: number): number {
    return this.getFavorites(activeUserId).length;
  }

  /**
   * Check if a user is favorited by the active user
   */
  public isFavorite(activeUserId: number, targetUserId: number): boolean {
    const favorites = this.getFavorites(activeUserId);
    return favorites.includes(targetUserId);
  }

  /**
   * Remove a user from favorites
   * Returns true if successfully removed, false if didn't exist
   */
  public removeFavorite(activeUserId: number, targetUserId: number): boolean {
    const favorites = this.getFavorites(activeUserId);
    const index = favorites.indexOf(targetUserId);

    if (index === -1) {
      return false;
    }

    favorites.splice(index, 1);
    this.saveFavorites(activeUserId, favorites);
    return true;
  }

  /**
   * Toggle a user's favorite status
   * Returns true if now favorited, false if unfavorited
   */
  public toggleFavorite(activeUserId: number, targetUserId: number): boolean {
    const isFavorited = this.isFavorite(activeUserId, targetUserId);

    if (isFavorited) {
      this.removeFavorite(activeUserId, targetUserId);
      return false;
    } else {
      this.addFavorite(activeUserId, targetUserId);
      return true;
    }
  }

  /**
   * Generate user-specific storage key
   */
  private getStorageKey(activeUserId: number): string {
    return `${FavoritesService.STORAGE_KEY_PREFIX}_${activeUserId}`;
  }

  /**
   * Save favorites to sessionStorage for a specific user
   */
  private saveFavorites(activeUserId: number, favorites: number[]): void {
    try {
      sessionStorage.setItem(this.getStorageKey(activeUserId), JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to sessionStorage:', error);
    }
  }
}
