# File Management API Documentation

## Overview

The File Management API provides endpoints to upload, retrieve, delete, and search files with additional features like file categorization, date-based partitioning, and database integration. It supports both Base64 content and file object uploads.

---

## Base URL

```
http://localhost:3300
```

---

## Endpoints

### 1. Upload Single Base64 File

**Endpoint:**

```
POST /file/upload-single-base64
```

**Description:**
Uploads a single file from Base64 content.

**Request Body:**

```json
{
  "base64Content": "<Base64 string>",
  "folder": "<optional folder>"
}
```

**Response:**

```json
{
  "message": "File uploaded successfully.",
  "fileId": "<fileId>"
}
```

### 2. Upload Multiple Base64 Files

**Endpoint:**

```
POST /file/upload-multiple-base64
```

**Description:**
Uploads multiple files from Base64 content.

**Request Body:**

```json
{
  "files": [
    {
      "base64Content": "<Base64 string>",
      "folder": "<optional folder>"
    },
    {
      "base64Content": "<Base64 string>",
      "folder": "<optional folder>"
    }
  ]
}
```

**Response:**

```json
[
  {
    "fileName": "file1.jpg",
    "fileId": "<fileId>",
    "status": "Uploaded successfully"
  },
  {
    "fileName": "file2.png",
    "fileId": "<fileId>",
    "status": "Uploaded successfully"
  }
]
```

### 3. Upload Single File Object

**Endpoint:**

```
POST /file/upload-single
```

**Description:**
Uploads a single file object (e.g., from client file input).

**Headers:**

```
Content-Type: multipart/form-data
```

**Form Data:**

- `file` (File): The file to upload.
- `folder` (String, optional): Folder of the file.

**Response:**

```json
{
  "message": "File uploaded successfully.",
  "fileId": "<fileId>"
}
```

### 4. Upload Multiple File Objects

**Endpoint:**

```
POST /file/upload-multiple
```

**Description:**
Uploads multiple file objects (e.g., from client file input).

**Headers:**

```
Content-Type: multipart/form-data
```

**Form Data:**

- `files` (Array of Files): Files to upload.
- `folder` (String, optional): Folder of the files.

**Response:**

```json
[
  {
    "fileName": "file1.jpg",
    "fileId": "<fileId>",
    "status": "Uploaded successfully"
  },
  {
    "fileName": "file2.png",
    "fileId": "<fileId>",
    "status": "Uploaded successfully"
  }
]
```

### 5. File List and Search

**Endpoint:**

```
GET /file/list
```

**Description:**
Fetches a paginated list of files with optional search filters.

**Query Parameters:**

- `page` (Integer, optional, default: 1): Page number.
- `limit` (Integer, optional, default: 10): Number of files per page.
- `folder` (String, optional): Filter by folder.
- `fileName` (String, optional): Search by file name (supports partial matches).
- `startDate` (String, optional): Filter files uploaded after this date (YYYY-MM-DD).
- `endDate` (String, optional): Filter files uploaded before this date (YYYY-MM-DD).

**Response:**

```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "files": [
    {
      "fileId": "<fileId>",
      "fileName": "file1.jpg",
      "fileType": "image/jpeg",
      "fileSize": 1024,
      "folder": "documents",
      "uploadDate": "2024-12-01"
    },
    {
      "fileId": "<fileId>",
      "fileName": "file2.png",
      "fileType": "image/png",
      "fileSize": 2048,
      "folder": "images",
      "uploadDate": "2024-12-15"
    }
  ]
}
```

### 6. Read Single File

**Endpoint:**

```
GET /file/:fileId
```

**Description:**
Downloads or views a file by its ID.

**Path Parameters:**

- `fileId` (String): The unique ID of the file.

**Response:**
The file is downloaded as an attachment.

### 7. Delete Single File

**Endpoint:**

```
DELETE /file/:fileId
```

**Description:**
Deletes a file by its ID.

**Path Parameters:**

- `fileId` (String): The unique ID of the file.

**Response:**

```json
{
  "message": "File deleted successfully."
}
```

### 8. Delete Multiple Files

**Endpoint:**

```
DELETE /file/delete-multiple
```

**Description:**
Deletes multiple files by their IDs.

**Request Body:**

```json
{
  "fileIds": ["<fileId1>", "<fileId2>"]
}
```

**Response:**

```json
{
  "message": "Files deleted successfully.",
  "deletedCount": 2
}
```

---

## Additional Notes

- **File Size Limit:** Maximum file size is 5 MB.
- **Allowed File Types:** `image/jpeg`, `image/png`, `application/pdf`.
- **Folder Structure:** Files are stored in folders organized by folder and upload date (Year/Month).
- **Error Handling:** Proper error messages and status codes are returned for invalid input or server errors.
