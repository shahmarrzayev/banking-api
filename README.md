# Microservices Backend Application

This repository contains a backend application developed using a microservices architecture. The application consists of multiple services that work together to provide the overall functionality.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [License](#license)

## Overview
The main entry point of the application is the `app.js` file located in the `src` directory, which listens on port **3000**. In addition to the main application, there are two microservices under the `src/service` directory:
- **Transaction Service**
- **Customer Service**

Each microservice must be started independently before running the main application.

## Project Structure
```
├── src
│   ├── app.js         # Main application entry point (runs on port 3000)
│   └── service
│       ├── transaction  # Transaction microservice
│       └── customer     # Customer microservice
├── package.json       # Project configuration and scripts
└── README.md          # This file
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (version 12 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shahmarrzayev/banking-api.git
   cd banking-api
   ```
2. Install the dependencies:
   1. Main
   ```bash
   npm install
   ```
   2. Customer
   ```bash
   cd src/service/customer
   npm install
   ```
   3. Transaction
   ```bash
   cd src/service/transaction
   npm install
   ```

## Running the Application

To start the microservices and the main application locally, follow these steps:

1. **Start the Microservices:**
   Navigate to the microservices directory (each microservice is in `src/service`), and run the following command for each service:
   ```bash
   npm run start-local
   ```
   > Ensure that both the **Transaction Service** and **Customer Service** are up and running.

2. **Start the Main Application:**
   Once the microservices are running, start the main application located in the `src` directory:
   ```bash
   npm run start-local
   ```
   The application will run on port **3000**.

## License
This project is licensed under the [MIT License](LICENSE).
