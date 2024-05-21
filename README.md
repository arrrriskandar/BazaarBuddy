# BazaarBuddy

## Description

BazaarBuddy is an upcoming online marketplace application designed to connect buyers and sellers in a convenient and secure platform. With BazaarBuddy, users can browse a wide range of products, communicate with sellers, make purchases, and manage their orders, all in one place.

## Key Features

- **Browse and Buy**: Explore a diverse selection of products from various sellers.
- **Sell with Ease**: Create listings for your products and reach potential buyers effortlessly.
- **Chat with Sellers**: Communicate directly with sellers to get more information about products.
- **Secure Transactions**: Enjoy peace of mind with our secure payment processing system.
- **User-Friendly Interface**: Navigate the app with ease and make transactions smoothly.

## Contributors

- Kerin Wong ([@kerinwlt](https://github.com/kerinwlt))
- Muhamad Ar Iskandar ([@arrrrriskandar](https://github.com/arrrriskandar))
- Hubert Ang ([@hubertang](https://github.com/hubertang))

## Set Up Instructions

### Prerequisites

1. **Node.js and npm**: Make sure you have Node.js and npm installed on your machine. You can download them from [here](https://nodejs.org/).
2. **Git**: Ensure you have Git installed for cloning the repository. You can download it from [here](https://git-scm.com/).
3. **.env Files**: Ensure you have the necessary `.env` files provided, which contain configuration settings for the application.

### Step-by-Step Setup

1. **Clone the Repository**

   - Open your terminal or command prompt.
   - Navigate to the directory where you want to clone the project.
   - Run the following command to clone the BazaarBuddy repository:
     ```sh
     git clone https://github.com/yourusername/bazaarbuddy.git
     ```
   - Replace `yourusername` with the actual GitHub username if necessary.

2. **Navigate to the Project Directory**

   - Change into the project's root directory:
     ```sh
     cd bazaarbuddy
     ```

3. **Import .env Files**

   - Copy the provided `.env` files into the respective directories:
     - `client/.env`: This file should go into the `client` directory.
     - `server/.env`: This file should go into the `server` directory.
   - Ensure that these files are correctly placed in the root of their respective directories.

4. **Install Dependencies for the Frontend**

   - Navigate to the `client` directory:
     ```sh
     cd client
     ```
   - Install the required dependencies using npm:
     ```sh
     npm install
     ```

5. **Run the Frontend**

   - Start the React Native (or React) development server:
     ```sh
     npm start
     ```

6. **Install Dependencies for the Backend**

   - Open a new terminal window or tab.
   - Navigate to the `server` directory:
     ```sh
     cd server
     ```
   - Install the required dependencies using npm:
     ```sh
     npm install
     ```

7. **Run the Backend**
   - Start the backend server:
     ```sh
     npm start
     ```

### Additional Notes

- **Frontend**: The frontend application should now be running and accessible via Expo (if using Expo for React Native) or in your web browser (if using a web-based React setup).
- **Backend**: The backend server should now be running and typically accessible via `http://localhost:PORT`, where `PORT` is specified in your `.env` file (default is often `3000`).
- **Environment Variables**: Ensure that all required environment variables are correctly set in the `.env` files. This typically includes API keys, database URIs, and other configuration settings.
- **Common Issues**:
  - If you encounter issues with missing modules or packages, try running `npm install` again in both the `client` and `server` directories.
  - Ensure that the versions of Node.js and npm are compatible with the project requirements specified in the `package.json` files.

By following these detailed instructions, you should be able to set up and run the BazaarBuddy application successfully. If you encounter any issues or need further assistance, please refer to the project's documentation or reach out to the contributors.
