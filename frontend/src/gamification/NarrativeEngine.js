// NarrativeEngine.js

export class NarrativeEngine {
  constructor(eventBus, loreData) {
    this.eventBus = eventBus;
    this.loreData = loreData;
    this.unlockedLoreIds = new Set();
    this.channelVisitCount = 0;
    this.visitedChannels = new Set();
  }

  init() {
    this.eventBus.on('user-action', this.handleUserAction.bind(this));
  }

  handleUserAction(action) {
    // Example action: { type: 'visit-channel', value: 'general' }
    this.loreData.forEach(fragment => {
      if (this.unlockedLoreIds.has(fragment.id)) return;

      // Trigger matching logic
      switch (fragment.trigger.type) {
        case 'visit-channel':
          if (action.type === 'visit-channel' && action.value === fragment.trigger.value) {
            this.unlockLore(fragment);
          }
          // Track visited channels for count-based triggers
          if (action.type === 'visit-channel') {
            this.visitedChannels.add(action.value);
            this.channelVisitCount = this.visitedChannels.size;
          }
          break;
        case 'read-post':
          if (action.type === 'read-post' && action.value === fragment.trigger.value) {
            this.unlockLore(fragment);
          }
          break;
        case 'send-message':
          if (action.type === 'send-message') {
            this.unlockLore(fragment);
          }
          break;
        case 'visit-channel-count':
          if (this.channelVisitCount >= fragment.trigger.value) {
            this.unlockLore(fragment);
          }
          break;
        default:
          break;
      }
    });
  }

  unlockLore(fragment) {
    this.unlockedLoreIds.add(fragment.id);
    this.eventBus.emit('lore-unlocked', fragment);
    this.eventBus.emit('notification', { message: `New lore unlocked: ${fragment.title}` });
  }

  getUnlockedLoreIds() {
    return Array.from(this.unlockedLoreIds);
  }
}