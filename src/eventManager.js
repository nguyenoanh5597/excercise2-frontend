import axios from '@/axios';

class EventManager {
  listeners = {};
  running = false;

  start = async () => {
    if (this.running) {
      // already started
      return
    }
    this.running = true;
    const longPolling = async () => {
      try {
        const event = await axios.get(`event`);
        this.processEvent(event);
        await longPolling();
      } catch (e) {
        if (e.message === 'STOP_LONG_POLLING') {
          // expected
        } else {
          await longPolling();
        }
      }
    }
    await longPolling();
  }

  processEvent = (event) => {
    // notify the listeners
    const {editorId, eventType,} = event;
    // console.log('eventId', eventId, 'eventType', eventType, 'editorId', editorId, 'data', data)
    if (this.listeners[eventType][editorId]) {
      this.listeners[eventType][editorId].forEach(callback => {
        try {
          callback(event);
        } catch (e) {
          // ignore
        }
      })
    }
  }

  onEditorUpdate = (editorId, callback) => {
    this.addListener('EDITOR_UPDATE', editorId, callback);
  }

  onEditorLiveUpdate = (editorId, callback) => {
    this.addListener('EDITOR_CONTENT_LIVE_UPDATE', editorId, callback);
  }

  onEditorVisibilityChanged = (editorId, callback) => {
    this.addListener('EDITOR_VISIBILITY_CHANGED', editorId, callback);
  }

  addListener = (eventType, editorId, callback) => {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = {};
    }
    if (!this.listeners[eventType][editorId]) {
      this.listeners[eventType][editorId] = [];
    }
    this.listeners[eventType][editorId].push(callback);
  }
}

const eventManager = new EventManager();
eventManager.start();
export default eventManager;