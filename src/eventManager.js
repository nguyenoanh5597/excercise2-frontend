import axios from '@/axios';

class EventManager {
  editorUpdateListeners = {};
  editorLiveUpdateListeners = {};
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
    const {editorId, eventId, eventType, data} = event;
    console.log('eventId', eventId, 'eventType', eventType, 'editorId', editorId, 'data', data)
    console.log(this.editorUpdateListeners);
    switch (eventType) {
      case 'EDITOR_CONTENT_UPDATE': {
        if (this.editorUpdateListeners[editorId]) {
          this.editorUpdateListeners[editorId].forEach(callback => {
            try {
              callback(event);
            } catch (e) {
              // ignore
            }
          })
        }
        break
      }
      case 'EDITOR_CONTENT_LIVE_UPDATE': {
        if (this.editorLiveUpdateListeners[editorId]) {
          this.editorLiveUpdateListeners[editorId].forEach(callback => {
            try {
              callback(event);
            } catch (e) {
              // ignore
            }
          })
        }
        break
      }
    }
  }

  onEditorUpdate = (editorId, callback) => {
    if (!this.editorUpdateListeners[editorId]) {
      this.editorUpdateListeners[editorId] = [];
    }
    this.editorUpdateListeners[editorId].push(callback);
  }

  onEditorLiveUpdate = (editorId, callback) => {
    if (!this.editorLiveUpdateListeners[editorId]) {
      this.editorLiveUpdateListeners[editorId] = [];
    }
    this.editorLiveUpdateListeners[editorId].push(callback);
  }
}

const eventManager = new EventManager();
eventManager.start();
export default eventManager;