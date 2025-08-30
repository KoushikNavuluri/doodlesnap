# Firestore Security Rules Setup

## Current Issue
You're getting a "PERMISSION_DENIED" error when trying to write to Firestore. This is because Firestore has security rules that prevent unauthorized access.

## Quick Fix for Testing

1. **Go to Firebase Console:**
   - Visit https://console.firebase.google.com/
   - Select your project: `doodlesnap-g1yib`

2. **Navigate to Firestore Database:**
   - Click on "Firestore Database" in the left sidebar
   - Go to the "Rules" tab

3. **Temporarily Allow All Writes (TESTING ONLY):**
   Replace your current rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // WARNING: These rules allow anyone to read/write your data
       // Only use for testing - update before production!
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

4. **Click "Publish" to apply the rules**

## Production Security Rules

Once testing is complete, replace with proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /images/{imageId} {
      allow read, write: if request.auth != null && 
                        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    match /doodleProjects/{projectId} {
      allow read, write: if request.auth != null && 
                        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Allow authenticated users to read templates
    match /templates/{templateId} {
      allow read: if request.auth != null;
      allow write: if false; // Only allow admin writes
    }
  }
}
```

## Alternative: Use Firebase Admin SDK

If you prefer server-side authentication:

1. **Generate a Firebase service account key:**
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Add environment variables:**
   ```env
   FIREBASE_PROJECT_ID=doodlesnap-g1yib
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. **Use Firebase Admin SDK in API routes**

## Recommended Steps:

1. **For immediate testing:** Use the temporary "allow all" rules
2. **Test image upload functionality**
3. **Once working:** Implement proper security rules
4. **For production:** Consider Firebase Admin SDK for server operations

## Important Security Notes:

- Never use `allow read, write: if true;` in production
- Always validate user authentication in security rules
- Test your security rules thoroughly before deployment
- Consider using Firebase Admin SDK for sensitive server operations
