import { NextRequest, NextResponse } from 'next/server';
import { simpleStorage } from '@/lib/simple-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const userId = formData.get('userId') as string;
    const isOriginal = formData.get('isOriginal') === 'true';
    const parentImageId = formData.get('parentImageId') as string | null;
    const stylePrompt = formData.get('stylePrompt') as string | null;
    const templateUsed = formData.get('templateUsed') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Google Cloud Storage with metadata
    const result = await simpleStorage.uploadImage({
      buffer,
      fileName: file.name,
      contentType: file.type,
      userId,
      metadata: {
        isOriginal,
        parentImageId: parentImageId || undefined,
        stylePrompt: stylePrompt || undefined,
        templateUsed: templateUsed || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      fileName: result.fileName,
      fileSize: file.size,
      contentType: file.type,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

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

    const images = await simpleStorage.getUserImages(userId);

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    });

  } catch (error) {
    console.error('Error fetching user images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user images' },
      { status: 500 }
    );
  }
}
