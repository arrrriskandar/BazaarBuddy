# Setup Instructions for BazaarBuddy

This document provides step-by-step guidance to set up the BazaarBuddy project locally.

## Prerequisites

Before setting up the project, ensure the following tools and services are available:

### Tools Required

1. **Node.js and npm**  
   Download and install from [nodejs.org](https://nodejs.org/).

2. **Git**  
   Download and install from [git-scm.com](https://git-scm.com/).

### Services Required

3. **Firebase Project**  
   Create a Firebase project via the [Firebase Console](https://console.firebase.google.com/).  
   Enable:

   - **Authentication** (e.g., Email/Password)
   - **Firebase Storage**

4. **MongoDB Database**  
   Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or run a local MongoDB instance.

5. **Stripe Account (for Payments)**  
   Sign up at [stripe.com](https://stripe.com) and obtain your secret key.

## Step-by-Step Setup

1. **Clone the Repository**

   - Open your terminal or command prompt.
   - Navigate to the directory where you want to clone the project.
   - Run the following command to clone the BazaarBuddy repository:
     ```sh
     git clone https://github.com/arrrriskandar/BazaarBuddy.git
     ```

2. **Navigate to the Project Directory**

   - Change into the project's root directory:
     ```sh
     cd bazaarbuddy
     ```

3. **Prepare and Import .env Files**

   - Inside both `client` and `server` directories, rename the example environment files from `.env.example` to `.env`.
   - Edit these `.env` files to add your own configuration values (Firebase API keys, MongoDB URI, etc.).
   - Ensure the `.env` files are located in the root of their respective directories:
     - `client/.env`
     - `server/.env`

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

- **Frontend**: The frontend application should now be running and accessible in your web browser at `http://localhost:3000`.

- **Backend**: The backend server should be running and accessible at `http://localhost:5001` by default.

- **Environment Variables**: Ensure that all required environment variables are correctly set in the `.env` files. These include API keys, database connection strings, and other necessary configuration settings.

- **Common Issues**:
  - If you encounter issues with missing modules or packages, try running `npm install` again in both the `client` and `server` directories.
  - Ensure that the versions of Node.js and npm are compatible with the project requirements specified in the `package.json` files.

By following these instructions, you should be able to successfully run both the frontend and backend of the BazaarBuddy application locally.
