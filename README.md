Step 1: Install Node.js and npm
Download and install Node.js (npm is included).
Verify installation:
node -v
npm -v

Step 2: Install MongoDB
Download MongoDB Community Server from MongoDB.
Follow the setup instructions to run MongoDB locally or connect to a MongoDB Atlas cluster if you're using the cloud.

Step 3: Clone or Create the Project
Clone your MERN project repository:
git clone https://github.com/Arfath02/NN.git
Navigate to the project directory:
cd NN

Step 4: Install Backend Dependencies
Navigate to the backend folder if the backend code is in a subdirectory:
cd backend
Install dependencies:
npm install

Step 5: Configure Environment Variables
Create a .env file in the backend folder with the necessary variables:
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Step 6: Start the Backend Server
Start the backend server:
npm run server
or, if using nodemon:
nodemon server.js

Step 7: Install Frontend Dependencies
Navigate to the frontend folder if in a subdirectory:
cd frontend
Install frontend dependencies:
npm install

Step 8: Start the Frontend Server
Start the frontend server:
npm start

Step 9: Access the Application
Open a browser and go to http://localhost:3000 to view the frontend.
Backend should be running on http://localhost:5000.
