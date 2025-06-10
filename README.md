# FiveM One UI Launcher

This project is a phone launcher interface for FiveM, designed to emulate the look and feel of Samsung's One UI. It provides a customizable and visually appealing phone experience for players.

## Current Features

*   **One UI Inspired Styling**:
    *   The overall interface, including color schemes, typography, and spacing, is based on One UI design principles.
    *   **Light and Dark Mode**: Users can switch between light and dark themes via the Settings app.
*   **Customizable Home Screen Launcher**:
    *   **App Grid Customization**: Select different app grid layouts (e.g., 4x4, 5x4, 5x5, 6x5) from the Settings app to arrange icons.
    *   **Pagination**: Multiple pages for apps with dot indicators.
    *   **Clock Widget**: Prominent time and date display on the first page of the launcher.
    *   **(Conceptual) Movable Icons**: Basic framework for drag-and-drop icon rearrangement is in place (further development needed for full functionality).
*   **Comprehensive Settings App**:
    *   **Dark Mode Toggle**: Enable or disable dark mode.
    *   **Twitter Notifications Toggle**: (Placeholder setting)
    *   **Home Screen Grid**: Customize the number of rows and columns for app icons on the launcher.
    *   **Phone Size**: Adjust the overall scale of the phone interface (Small, Medium, Large, Extra-Large).
*   **Core Phone Apps (Styled with One UI in mind)**:
    *   Contacts
    *   Messages
    *   Dialer (Call app)
    *   Twitter (basic view)
    *   Services
    *   (Other apps like Life Alert, Add Contact, etc., with basic One UI headers)

## How to Use Settings

1.  Open the **Settings app** from the launcher.
2.  **Dark Mode**: Toggle the "Dark Mode" switch.
3.  **Home Screen Grid**: Select your preferred grid layout from the available radio button options. The launcher will update immediately.
4.  **Phone Size**: Choose your desired phone scale (Small, Medium, Large, Extra-Large). The interface will resize instantly.

## Known Issues & Limitations

*   **Incomplete One UI App Bar & Scrolling**: The signature One UI feature where app headers collapse on scroll is not fully implemented. While the HTML structure was added, persistent technical issues prevented the necessary JavaScript and CSS changes from being saved. This means most apps do not yet have the dynamic collapsing header behavior.
*   **Drag-and-Drop Icons**: The functionality for users to manually rearrange icons on the home screen is only a basic placeholder. Full drag-and-drop logic is not yet implemented.
*   **Persistence**: Settings are currently session-based and will reset if the NUI is reloaded or the game is restarted. No backend persistence is implemented.
*   **Limited App Functionality**: Most apps are visual shells or have very basic functionality, primarily serving to demonstrate the UI.

## Future Enhancements (Planned)

*   Full implementation of the One UI expandable app bar and scrolling behavior.
*   Complete drag-and-drop functionality for home screen icons.
*   More detailed One UI styling for dialogs, pop-ups, and input fields.
*   Refined animations and transitions.
*   Further development of individual app functionalities.

---
This README reflects the state of the project as of the last commit before encountering persistent file saving issues.
