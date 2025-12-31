import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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
  console.log('[API] GET /api/settings/platform - Started (Raw SQL Mode)');
  try {
    // Fallback to defaults
    const defaults = {
      companyName: 'Kaven SaaS',
      primaryColor: '#00A76F',
      language: 'pt-BR',
      currency: 'BRL',
      numberFormat: '1.000,00',
    };

    // Use raw query to bypass stale client definition
    // Note: Double quotes for case sensitivity in Postgres
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = await prisma.$queryRaw`SELECT * FROM "PlatformConfig" LIMIT 1`;
    
    console.log('[API] Check result:', result);

    if (!result || result.length === 0) {
      console.log('[API] No config found, returning defaults.');
      return NextResponse.json(defaults);
    }

    // Convert raw result (which matches DB columns) to correct shape if needed
    // Prisma raw query returns columns. Model fields match columns here.
    return NextResponse.json(result[0]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[API] ❌ CRITICAL ERROR in GET:', error);
    
    // Check if error is "relation does not exist"
    if (String(error).includes('relation "PlatformConfig" does not exist')) {
        console.warn('[API] Table missing. Need migration? Returning defaults temporarily.');
        return NextResponse.json({
            companyName: 'Kaven SaaS',
            primaryColor: '#00A76F',
            language: 'pt-BR',
            currency: 'BRL',
            numberFormat: '1.000,00',
            logoUrl: '',
            faviconUrl: '',
            ogImageUrl: '',
            twitterHandle: ''
        });
    }

    return NextResponse.json({ 
        error: 'Internal Server Error', 
        message: error?.message, 
        stack: error?.stack,
        details: String(error)
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  console.log('[API] PUT /api/settings/platform - Started (Raw SQL Mode)');
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

    // Check existing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing: any[] = await prisma.$queryRaw`SELECT id FROM "PlatformConfig" LIMIT 1`;

    if (existing && existing.length > 0) {
       const id = existing[0].id;
       console.log('[API] Updating existing config ID:', id);
       
       // Update raw
       await prisma.$executeRaw`
         UPDATE "PlatformConfig"
         SET "companyName" = ${data.companyName},
             "description" = ${data.description || null},
             "primaryColor" = ${data.primaryColor},
             "language" = ${data.language},
             "currency" = ${data.currency},
             "numberFormat" = ${data.numberFormat || '1.000,00'},
             "logoUrl" = ${data.logoUrl || null},
             "faviconUrl" = ${data.faviconUrl || null},
             "ogImageUrl" = ${data.ogImageUrl || null},
             "twitterHandle" = ${data.twitterHandle || null},
             "updatedAt" = ${new Date()}
         WHERE "id" = ${id}
       `;
    } else {
       console.log('[API] Creating new config...');
       const newId = uuidv4();
       
       await prisma.$executeRaw`
         INSERT INTO "PlatformConfig" (
           "id", "companyName", "description", "primaryColor", "language", "currency", "numberFormat", "logoUrl", "faviconUrl", "ogImageUrl", "twitterHandle", "updatedAt"
         ) VALUES (
           ${newId}, ${data.companyName}, ${data.description || null}, ${data.primaryColor}, 
           ${data.language}, ${data.currency}, ${data.numberFormat || '1.000,00'}, 
           ${data.logoUrl || null}, ${data.faviconUrl || null}, 
           ${data.ogImageUrl || null}, ${data.twitterHandle || null},
           ${new Date()}
         )
       `;
    }

    // Fetch back to return canonical result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalResult: any[] = await prisma.$queryRaw`SELECT * FROM "PlatformConfig" LIMIT 1`;
    const storedConfig = finalResult[0];

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
