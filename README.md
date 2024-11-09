
# Project Title

Prescripto - Doctor Appointment Management System

A summary

Prescripto is a feature-rich web application that allows patients to effectively schedule appointments with physicians. It is built on the MERN stack. The system offers clinics and healthcare providers a comprehensive solution by streamlining the appointment scheduling, doctor administration, and user identification processes.


## Features

User authentication: safe registration and login for administrators, physicians, and patients.

Doctor Management: Administrators have the power to add, edit, and oversee the profiles of doctors, including their availability, experience, and areas of expertise.

Appointment Scheduling: Patients are able to manage their reservations, schedule appointments, and view available timeslots.

Admin Panel: All-inclusive capabilities for scheduling appointments, managing doctors, and tracking system metrics.

Doctor Panel: A special panel where physicians can view appointments, manage their schedules, and communicate with patients.

Payment Integration: Razorpay offers secure online payment capabilities for scheduling appointments.

Profile Management: Users have the ability to examine previous and upcoming appointments as well as manage their profiles.


## Tech Stack

Frontend: React (developed with Vite), Tailwind CSS for styling, and React Router DOM for navigation.

Backend: Express.js, Node.js.
MongoDB is the database, and MongoDB Compass is used for management.

JSON Web Tokens (JWT) are used for secure connections as authentication.

Cloudinary and Multer are used to manage file uploads.
Payments: Razorpay is integrated.

Extra Resources:

Bcryptjs: For security and hashing passwords.

Cloudinary: For managing and storing images.

Cookie-parser: To interpret HTTP requests' cookies.

cors: To respond to requests from different origins.

Dotenv: For controlling environmental factors.

Express: The API's backend framework.

jsonwebtoken: Used to generate and validate JWTs.

MongoDB object modeling is done with mongoose.

multer: For managing uploads of files.

nodemon: To restart the server automatically while it's being developed.

validater: For the purpose of requesting data validation


# Installation

## Prerequisites

Node.js and npm installed.

MongoDB instance running (local or cloud-based).

A Cloudinary account for image management.

Razorpay account for payment integration.

## Clone the Repository

git clone https://github.com/yourusername/prescripto.git

cd prescripto

## Backend Setup

1. Navigate to the backend directory:

```bash
   cd backend
```
2. Install dependencies:

```bash
   npm intall
```


## Environment Variables

3. To run this project, you will need to add the following 


environment variables to your .env file

PORT=4000

MONGODB_URI=mongodb://localhost:27017

CLOUDINARY_NAME=your_cloudinary_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret

JWT_SECRET=your_jwt_secret

## backend Setup

4. Start the backend server:

```bash
   cd backend
```

```bash
  npm run dev
```
## Frontend Setup

1. Navigate to the frontend directory:

```bash
   cd frontend
```

2. Install dependencies:

```bash
   npm install
```

3. Configure environment variables by creating a .env file:

VITE_BACKEND_URL=*****

4. Start the frontend server:

```bash
   npm run dev
```

##  Admin Setup

1. Navigate to the admin directory:

1. Navigate to the frontend directory:

```bash
   cd admin
```

2. Install dependencies:

```bash
   npm install
```

3. Configure environment variables by creating a .env file:

VITE_BACKEND_URL=http://localhost:4000

4. Start the frontend server:

```bash
   npm run dev
```

## Usage

Patient: To schedule an appointment, register or log in. View available doctors and choose a suitable time slot.

Doctor: To handle appointments and scheduling, log onto the doctor panel.

Admin: To manage physicians, appointments, and system analytics, log in to the admin interface.