import Header from '@/components/Header';
import ImageUploadTest from '@/components/ImageUploadTest';
import UserImageGallery from '@/components/UserImageGallery';
import DoodleProjectGallery from '@/components/DoodleProjectGallery';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TestUploadPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center p-4 md:p-8">
          <div className="w-full max-w-6xl space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">Image Upload Test</h1>
              <p className="text-muted-foreground mt-2">
                Test Google Cloud Storage integration
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex justify-center">
                <ImageUploadTest />
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div>
                  <DoodleProjectGallery />
                </div>
                <div>
                  <UserImageGallery />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
