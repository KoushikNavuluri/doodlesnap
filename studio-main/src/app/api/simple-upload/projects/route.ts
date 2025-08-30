import { NextRequest, NextResponse } from 'next/server';
import { simpleStorage } from '@/lib/simple-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const projects = await simpleStorage.getUserDoodleProjects(userId);

    return NextResponse.json({
      success: true,
      projects,
      count: projects.length,
    });

  } catch (error) {
    console.error('Error fetching user Doodle Snaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user Doodle Snaps' },
      { status: 500 }
    );
  }
}
