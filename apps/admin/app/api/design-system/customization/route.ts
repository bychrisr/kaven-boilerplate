import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/design-system/customization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customization = await prisma.designSystemCustomization.findUnique({
      where: { userId: session.user.id },
    });

    if (!customization) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Transform to match UserCustomization interface
    const response = {
      id: customization.id,
      userId: customization.userId,
      designSystem: customization.designSystem.toLowerCase(),
      mode: customization.mode,
      colors: {
        primary: customization.colorPrimary,
        secondary: customization.colorSecondary,
        success: customization.colorSuccess,
        warning: customization.colorWarning,
        error: customization.colorError,
        info: customization.colorInfo,
      },
      typography: {
        fontFamily: customization.fontFamily,
        fontSize: customization.fontSizeScale,
      },
      spacing: {
        scale: customization.spacingScale,
      },
      radius: {
        scale: customization.radiusScale,
      },
      createdAt: customization.createdAt,
      updatedAt: customization.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching customization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/design-system/customization
export async function POST(_request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await _request.json();

    // Upsert customization
    const customization = await prisma.designSystemCustomization.upsert({
      where: { userId: session.user.id },
      update: {
        designSystem: body.designSystem?.toUpperCase() || 'MUI',
        mode: body.mode || 'light',
        colorPrimary: body.colors?.primary,
        colorSecondary: body.colors?.secondary,
        colorSuccess: body.colors?.success,
        colorWarning: body.colors?.warning,
        colorError: body.colors?.error,
        colorInfo: body.colors?.info,
        fontFamily: body.typography?.fontFamily,
        fontSizeScale: body.typography?.fontSize,
        spacingScale: body.spacing?.scale,
        radiusScale: body.radius?.scale,
      },
      create: {
        userId: session.user.id,
        designSystem: body.designSystem?.toUpperCase() || 'MUI',
        mode: body.mode || 'light',
        colorPrimary: body.colors?.primary,
        colorSecondary: body.colors?.secondary,
        colorSuccess: body.colors?.success,
        colorWarning: body.colors?.warning,
        colorError: body.colors?.error,
        colorInfo: body.colors?.info,
        fontFamily: body.typography?.fontFamily,
        fontSizeScale: body.typography?.fontSize,
        spacingScale: body.spacing?.scale,
        radiusScale: body.radius?.scale,
      },
    });

    // Transform response
    const response = {
      id: customization.id,
      userId: customization.userId,
      designSystem: customization.designSystem.toLowerCase(),
      mode: customization.mode,
      colors: {
        primary: customization.colorPrimary,
        secondary: customization.colorSecondary,
        success: customization.colorSuccess,
        warning: customization.colorWarning,
        error: customization.colorError,
        info: customization.colorInfo,
      },
      typography: {
        fontFamily: customization.fontFamily,
        fontSize: customization.fontSizeScale,
      },
      spacing: {
        scale: customization.spacingScale,
      },
      radius: {
        scale: customization.radiusScale,
      },
      createdAt: customization.createdAt,
      updatedAt: customization.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error saving customization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/design-system/customization
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.designSystemCustomization.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
