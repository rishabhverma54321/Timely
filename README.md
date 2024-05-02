# Timely Extension Readme

## Overview
Timely is a Chrome extension designed to facilitate communication of specific times across various time zones. This project utilizes technologies such as Preact for the frontend, Parcel for JavaScript bundling, and TypeScript for type safety.

## Installation
Follow these steps to install Timely on your local machine:

1. **Fork and Clone**: 
   - Fork this repository to your GitHub account.
   - Clone the forked repository to your local machine using `git clone`.

   ```bash
   git clone https://github.com/your-username/Timely.git
   ```

2. **Navigate to Project Directory**:
   - Use the `cd` command to navigate into the project directory.

   ```bash
   cd Timely
   ```

3. **Install Dependencies**:
   - Use `yarn` to install project dependencies.

   ```bash
   yarn install
   ```

## Usage
After successfully installing the project, follow these steps to use Timely as a Chrome extension:

1. **Build the Project**:
   - Run the following command to build the project.

   ```bash
   yarn build
   ```

2. **Load the Extension**:
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable Developer Mode by toggling the switch located at the top-right corner of the page.
   - Click on the "Load Unpacked" button.
   - Select the `dist` folder within your Timely project directory.
   
3. **Pin the Extension**:
   - Once the extension is loaded, click on the Timely extension icon.
   - Click on the three dots at the top-right corner of the extension popup.
   - Select "Pin" to keep the extension icon visible in the Chrome toolbar for easy access.

4. **Set Up Timely**:
   - Click on the Timely extension icon to open the popup.
   - Fill in the required details such as prefix and timezone for communication.
   
5. **Using Timely**:
   - After setting up Timely, you can use the following format to communicate times: `$prefixHH:MM`, where `$prefix` is the prefix you specified and `HH:MM` is the time in 24-hour format.

## Contributing
Contributions to Timely are welcome! If you have any suggestions, improvements, or bug fixes, please feel free to open an issue or submit a pull request. Make sure to follow the project's code of conduct.

## License
This project is licensed under the [MIT License](LICENSE.md). Feel free to use, modify, and distribute the code for personal or commercial purposes.