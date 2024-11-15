import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { getInputSourceManager } from 'resource:///org/gnome/shell/ui/status/keyboard.js';

export default class OverviewInputSwitcherExtension extends Extension {
    set source(index) {
        try {
            if (this._inputSourceManager.inputSources[index]) {
                this._inputSourceManager.inputSources[index].activate();
            }
        } catch (e) {
            log(`[Overview Input Switcher] Failed to switch input source: ${e}`);
        }
    }

    enable() {
        this._inputSourceManager = getInputSourceManager();
        if (!this._inputSourceManager) {
            log('[Overview Input Switcher] Input source manager not available');
            return;
        }
        
        this._showingId = Main.overview.connect('showing', () => {
            this._source = this._inputSourceManager.currentSource.index;
            this.source = 0;
        });
        
        this._hidingId = Main.overview.connect('hiding', () => {
            this.source = this._source;
        });
    }

    disable() {
        if (this._showingId) {
            Main.overview.disconnect(this._showingId);
            this._showingId = null;
        }
        
        if (this._hidingId) {
            Main.overview.disconnect(this._hidingId);
            this._hidingId = null;
        }
        
        this._inputSourceManager = null;
        this._source = null;
    }
}
