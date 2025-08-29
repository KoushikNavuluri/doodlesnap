import Header from '@/components/Header';
import DoodleStudio from '@/components/DoodleStudio';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <DoodleStudio />
        </main>
      </div>
    </ProtectedRoute>
  );
}
