import Header from '@/components/Header';
import IntegratedDoodleStudio from '@/components/IntegratedDoodleStudio';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <IntegratedDoodleStudio />
        </main>
      </div>
    </ProtectedRoute>
  );
}
