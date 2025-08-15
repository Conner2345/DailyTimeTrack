// Storage interface for the time tracking app
// Since we're using localStorage on the client, this is mostly unused

export interface IStorage {
  // Placeholder for future server-side storage needs
}

export class MemStorage implements IStorage {
  constructor() {
    // Minimal storage implementation
  }
}

export const storage = new MemStorage();
