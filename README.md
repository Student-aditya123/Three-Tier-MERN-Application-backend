# Student Management System – Backend

A Node.js and Express-based REST API for a Student Management System, integrated with **MongoDB** for database operations and **AWS S3** for cloud-based file storage.

The backend is deployed on AWS EC2 and demonstrates REST API development, cloud storage integration, database connectivity, and server-side deployment.

## 🚀 Features

- RESTful API development using Express.js.
- Student data management.
- MongoDB database integration.
- File uploads to AWS S3.
- Unique file identification and storage keys.
- Cloud-based file storage.
- Backend deployment on AWS EC2.
- Process management using PM2.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| AWS S3 | File storage |
| AWS EC2 | Backend deployment |
| PM2 | Process management |
| Git & GitHub | Version control |

## 🏗️ Architecture

```text
             React Frontend
                    |
                    | HTTP Requests
                    v
              AWS EC2 Instance
                    |
                    v
              Node.js + Express
                    |
             +------+------+
             |             |
             v             v
          MongoDB        AWS S3
          Database     File Storage
```

## 📂 Project Structure

```text
student-backend/
│
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
│
├── server.js
├── package.json
├── .env
└── README.md
```

*The structure may vary depending on the final implementation.*

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/Student-aditya123/student-backend.git
```

### 2. Navigate to the project

```bash
cd student-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

AWS_REGION=YOUR_AWS_REGION
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
AWS_BUCKET_NAME=YOUR_S3_BUCKET_NAME
```

**Important:** Never commit your `.env` file or AWS credentials to GitHub.

### 5. Start the backend

```bash
node server.js
```

The backend server will start on the configured port.

## ☁️ AWS Deployment

The backend is deployed on an AWS EC2 instance and integrated with MongoDB and Amazon S3.

### Deployment workflow

1. Launch an AWS EC2 instance.
2. Install Node.js and Git.
3. Clone the backend repository.
4. Install application dependencies.
5. Configure environment variables.
6. Connect the application to MongoDB.
7. Configure AWS credentials and S3 access securely.
8. Test file uploads to S3.
9. Start and manage the backend process using PM2.

### PM2 Process Management

Start the backend using:

```bash
pm2 start server.js --name student-backend
```

Check running processes:

```bash
pm2 status
```

View application logs:

```bash
pm2 logs student-backend
```

Save the process list:

```bash
pm2 save
```

## ☁️ AWS S3 Integration

Amazon S3 is used to store uploaded files separately from the backend application.

### File upload workflow

```text
User uploads file
       |
       v
React Frontend
       |
       v
Express API
       |
       v
AWS S3 Bucket
       |
       v
File uploaded successfully
       |
       v
File metadata saved in MongoDB
```

The application stores the file in S3 and saves the corresponding file information and S3 object key in MongoDB.

## 🧪 Testing

The S3 upload and MongoDB integration were tested successfully.

Example test output:

```text
S3 Upload Successful!
MongoDB Save Successful!

File ID: <generated-file-id>
S3 Key: uploads/<generated-file-name>
```

## 🔗 Related Repository

**Frontend:** [student-frontend](https://github.com/Student-aditya123/student-management-frontend.git)

## 🎯 Learning Outcomes

- Backend development using Node.js and Express.
- REST API development.
- MongoDB database connectivity.
- AWS S3 file storage integration.
- EC2 server deployment.
- PM2 process management.
- Cloud-based application architecture.
- Environment variable and credential management.

## 👨‍💻 Author

**Aditya Singh**

B.Tech Computer Science & Engineering

[GitHub](https://github.com/Student-aditya123)

---

⭐ If you find this project useful, consider giving it a star!
