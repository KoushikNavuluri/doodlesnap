import { NextRequest, NextResponse } from 'next/server';
import { simpleStorage } from '@/lib/simple-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('API: Fetching Doodle Snaps for userId:', userId);

    if (!userId) {
      console.error('API: No userId provided');
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const projects = await simpleStorage.getUserDoodleProjects(userId);

    console.log('API: Successfully fetched projects:', projects.length);
    return NextResponse.json({
      success: true,
      projects,
      count: projects.length,
    });

  } catch (error) {
    console.error('API Error fetching user Doodle Snaps:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user Doodle Snaps' 
      },
      { status: 500 }
    );
  }
}
