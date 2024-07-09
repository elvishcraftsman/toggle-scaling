// Import the necessary imports
import St from 'gi://St'; // Will this be needed later?
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
//import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js'; // This will be needed when I add the menu
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';

// Define the Quick Settings Menu so as to put the toggle button into it
const QSMenu = Main.panel.statusArea.quickSettings;

// Define the two font-scaling factors
let undocked_factor = 1.20;
let docked_factor = 1.00;

// Create the toggle button with menu
const DockToggle = GObject.registerClass(
    class DockToggle extends QuickSettings.QuickToggle { //class DockToggle extends QuickSettings.QuickMenuToggle {
        _init(QuickToggle) {
            super._init({
                title: _('Scaling'),
                subtitle: _('Undocked'),
                toggleMode: true,
                iconName: 'preferences-desktop-font',
            });
    
            // Add header with icon and title (once we are ready for a menu and not just a button)
            //this.menu.setHeader('preferences-desktop-font', _('Scaling'));

            // Get the GNOME setting to change the text-scaling factor. 
            this._textScalingSetting = new Gio.Settings({schema_id: 'org.gnome.desktop.interface'});
            
            // Bind toggle of button to a function that can decide what to do
            this.connect('notify::checked', this._onToggle.bind(this));

            // The menu will be created here in future

        }

        _onToggle() {
            // This function will be called when the toggle button is checked or unchecked
            if (this.checked) {
                // If the toggle button is checked
                this.subtitle = _('Docked');
                this._setTextScaling(docked_factor);
            } else {
                // If the toggle button is unchecked
                this.subtitle = _('Undocked');
                this._setTextScaling(undocked_factor);
            }
        }

        // Set the text scaling property to the correct choice
        _setTextScaling(factor) {
            this._textScalingSetting.set_double('text-scaling-factor', factor);
        }
    });


export default class ToggleTextScaling extends Extension {
    // When extension is enabled:
    enable() {
        // Create an instance of the toggle menu
        this._toggle = new DockToggle();
        // Make it appear before background apps (if possible, rewrite the following to make it simpler)
        let backgroundApps = QSMenu._backgroundApps ?? null;
        QSMenu.menu.insertItemBefore(this._toggle, backgroundApps);
    }

    // When extension is disabled:
    disable() {
        // Destroy the button with future code
    }
}