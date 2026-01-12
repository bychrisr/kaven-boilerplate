import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const platformConfigSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  description: z.string().default(''),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color code'),
  language: z.string(),
  currency: z.string(),
  numberFormat: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  twitterHandle: z.string().optional(),
});

export async function GET() {
  console.log('[API] GET /api/settings/platform - Started (ORM Mode)');
  try {
    // Fallback to defaults
    const defaults = {
      companyName: 'Kaven SaaS',
      primaryColor: '#00A76F',
      language: 'pt-BR',
      currency: 'BRL',
      numberFormat: '1.000,00',
    };

    // ✅ KAVEN STYLE: Use Prisma ORM for consistency and safety
    const config = await prisma.platformConfig.findFirst();
    
    console.log('[API] Fetch result:', config);

    if (!config) {
      console.log('[API] No config found, returning defaults.');
      return NextResponse.json(defaults);
    }

    return NextResponse.json(config);

  } catch (error) {
    console.error('[API] ❌ CRITICAL ERROR in GET:', error);
    const apiError = error as any;
    return NextResponse.json({ 
        error: 'Internal Server Error', 
        message: apiError?.message, 
        details: String(error)
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  console.log('[API] PUT /api/settings/platform - Started (ORM Mode)');
  try {
    const body = await req.json();
    console.log('[API] PUT Body:', JSON.stringify(body, null, 2));

    const result = platformConfigSchema.safeParse(body);

    if (!result.success) {
      console.error('[API] Validation Failed:', result.error.flatten());
      return NextResponse.json({ 
        error: 'Validation Error', 
        details: result.error.flatten() 
      }, { status: 400 });
    }

    const { data } = result;

    // ✅ KAVEN STYLE: Use Prisma ORM methods
    const existing = await prisma.platformConfig.findFirst({
      select: { id: true }
    });

    let storedConfig;

    if (existing) {
       console.log('[API] Updating existing config ID:', existing.id);
       storedConfig = await prisma.platformConfig.update({
         where: { id: existing.id },
         data: {
           companyName: data.companyName,
           description: data.description || null,
           primaryColor: data.primaryColor,
           language: data.language,
           currency: data.currency,
           numberFormat: data.numberFormat || '1.000,00',
           logoUrl: data.logoUrl || null,
           faviconUrl: data.faviconUrl || null,
           ogImageUrl: data.ogImageUrl || null,
           twitterHandle: data.twitterHandle || null,
         }
       });
    } else {
       console.log('[API] Creating new config...');
       storedConfig = await prisma.platformConfig.create({
         data: {
           companyName: data.companyName,
           description: data.description || null,
           primaryColor: data.primaryColor,
           language: data.language,
           currency: data.currency,
           numberFormat: data.numberFormat || '1.000,00',
           logoUrl: data.logoUrl || null,
           faviconUrl: data.faviconUrl || null,
           ogImageUrl: data.ogImageUrl || null,
           twitterHandle: data.twitterHandle || null,
         }
       });
    }

    console.log('[API] Save successful:', storedConfig);
    return NextResponse.json(storedConfig);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[API] ❌ CRITICAL ERROR in PUT:', error);
    return NextResponse.json({ 
        error: 'Internal Server Error', 
        message: error?.message, 
        stack: error?.stack,
        details: String(error)
    }, { status: 500 });
  }
}
