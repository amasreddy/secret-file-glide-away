
# SecureShare Backend

This is the backend server for the SecureShare file sharing application with end-to-end encryption.

## Features

- File upload with 2GB size limit
- Automatic file deletion after 7 days
- Rate limiting for security
- CORS support for frontend integration
- Encrypted file storage (files are encrypted before reaching the server)

## Installation

1. Save the server code as `server.js`
2. Create a `package.json` file with the provided dependencies
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3001 by default.

## Environment Variables

- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

## API Endpoints

### Upload File
- **POST** `/api/upload`
- Upload an encrypted file
- Returns: `{ fileId, message }`

### Download File
- **GET** `/api/download/:fileId`
- Download an encrypted file
- Returns: File stream with original filename in headers

### File Info
- **GET** `/api/info/:fileId`
- Get file metadata
- Returns: `{ originalName, uploadDate, size }`

### Health Check
- **GET** `/health`
- Server health status
- Returns: `{ status, timestamp }`

## Deployment

### Railway
1. Create a new Railway project
2. Connect your GitHub repository
3. Railway will automatically detect Node.js and deploy

### Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`

### Heroku
1. Create a new Heroku app
2. Connect your GitHub repository
3. Enable automatic deploys

## Security Features

- Rate limiting on uploads and downloads
- Helmet.js for security headers
- CORS protection
- File size limits
- Automatic file cleanup

## File Storage

Files are stored in the `uploads/` directory with UUID filenames. In production, consider using cloud storage like AWS S3 or Google Cloud Storage.

## Database

Currently uses in-memory storage for file metadata. For production, implement a database like PostgreSQL or MongoDB to store file metadata persistently.
