# Google Cloud Storage Setup Guide

This document provides step-by-step instructions for setting up Google Cloud Storage for the DoodleSnap application.

## Prerequisites

1. Google Cloud account
2. Google Cloud project created
3. Billing enabled for the project
4. Google Cloud Storage bucket created (named "doodle-snap")

## Setup Instructions

### 1. Service Account Setup

1. **Create a Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Provide a name: `doodlesnap-storage-service`
   - Provide a description: `Service account for DoodleSnap image storage`

2. **Grant Permissions:**
   - In the "Service account permissions" step, add the following roles:
     - `Storage Admin` (for full control over storage buckets)
     - `Storage Object Admin` (for managing objects in buckets)
   - Click "Continue" and then "Done"

3. **Create a Key:**
   - Find your service account in the list
   - Click on the three dots under "Actions" and select "Manage keys"
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format and click "Create"
   - Download the JSON key file

### 2. Environment Configuration

1. **Place the Service Account Key:**
   - Create a `credentials` folder in your project root: `studio-main/credentials/`
   - Place the downloaded JSON key file in this folder
   - Rename it to something like `service-account-key.json`

2. **Create Environment Variables:**
   
   Create a `.env.local` file in the `studio-main` directory with the following content:

   ```env
   # Google Cloud Storage Configuration
   GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
   GOOGLE_CLOUD_KEY_FILE=./credentials/service-account-key.json

   # Alternative: Use GOOGLE_APPLICATION_CREDENTIALS
   # GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account-key.json
   ```

   Replace `your-actual-project-id` with your actual Google Cloud project ID.

### 3. Security Considerations

1. **Add to .gitignore:**
   Ensure these files are in your `.gitignore`:
   ```
   .env.local
   .env
   credentials/
   ```

2. **File Permissions:**
   - Keep your service account key file secure
   - Never commit it to version control
   - Set appropriate file permissions (read-only for the application user)

### 4. Bucket Configuration

Your bucket "doodle-snap" should be configured with:

- **Location:** Choose based on your target audience
- **Storage Class:** Standard (for frequently accessed images)
- **Access Control:** Uniform bucket-level access
- **Public Access:** Configure as needed for your use case

### 5. Alternative Authentication Methods

#### Using Application Default Credentials (ADC)

If you're deploying to Google Cloud (App Engine, Cloud Run, etc.), you can use ADC instead of a service account key file:

1. Remove the `GOOGLE_CLOUD_KEY_FILE` environment variable
2. Ensure your service has the appropriate IAM roles
3. The application will automatically use the service account attached to the compute resource

#### Using gcloud CLI for Development

For local development, you can also authenticate using:

```bash
gcloud auth application-default login
```

This sets up ADC for your local environment.

### 6. Testing the Setup

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```

2. **Test Image Upload:**
   - Navigate to a page with the image upload functionality
   - Try uploading an image
   - Check the Google Cloud Storage bucket to verify the image was uploaded
   - Check the Firestore database to verify metadata was saved

### 7. Troubleshooting

#### Common Issues:

1. **Authentication Error:**
   - Verify the service account key file path is correct
   - Ensure the service account has the necessary permissions
   - Check that the project ID is correct

2. **Bucket Not Found:**
   - Verify the bucket name is correct ("doodle-snap")
   - Ensure the bucket exists in the specified project
   - Check that the service account has access to the bucket

3. **Permission Denied:**
   - Verify the service account has "Storage Admin" or "Storage Object Admin" roles
   - Check bucket-level permissions
   - Ensure the bucket policy allows the service account access

4. **CORS Issues (if accessing from browser):**
   - Configure CORS settings for your bucket if needed
   - Set appropriate allowed origins and methods

### 8. Production Deployment

For production deployment:

1. **Use managed services** when possible (Cloud Run, App Engine)
2. **Store secrets securely** using Google Secret Manager
3. **Use IAM roles** instead of service account keys
4. **Enable audit logging** for security monitoring
5. **Set up monitoring** and alerting for storage operations

## Next Steps

Once setup is complete, you can:

1. Upload images through the application
2. View uploaded images in the Google Cloud Storage bucket
3. Check image metadata in Firestore
4. Implement additional features like image deletion, bulk uploads, etc.

For more information, refer to the [Google Cloud Storage documentation](https://cloud.google.com/storage/docs).
