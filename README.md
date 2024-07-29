# TubeSkip (Firefox)

TubeSkip is a browser extension that allows you to skip YouTube videos based on keywords such as banned artists. This extension provides a simple interface to manage your list of banned artists and ensures that videos from these artists are skipped automatically.

## Features

- Add and remove artists from the banned list.
- Automatically skip videos from banned artists.
- Syncs banned artists list across different browser sessions.

## Installation

1. Clone the repository to your local machine.

    ```sh
    git clone https://github.com/MichealReed/TubeSkip.git
    ```

2. Open your browser and navigate to the developer extensions page.
    - For Chrome: `chrome://extensions/`
    - For Firefox: `about:debugging`
3. Enable "Developer mode" (for Chrome) or "This Firefox" (for Firefox).
4. Click on "Load Temporary Add-on" or "Load unpacked" and select the cloned repository folder.

## Usage

1. Click on the TubeSkip icon in your browser toolbar to open the popup.
2. In the popup, you can add a new banned artist by entering the artist's name and clicking the "Add" button.
3. The list of banned artists will be displayed. You can remove an artist by clicking the "Remove" button next to their name.
4. The extension will automatically skip videos from the banned artists on YouTube.

## Files

- `background.js`: Handles background tasks such as storing and retrieving the list of banned artists.
- `content.js`: Observes changes on YouTube pages and skips videos from banned artists.
- `popup.js`: Manages the popup interface for adding and removing banned artists.
- `popup.html`: The HTML file for the popup interface.
- `manifest.json`: The manifest file that defines the extension's properties and permissions.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
