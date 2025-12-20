import { FastifyRequest, FastifyReply } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { prisma } from '../../../lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export class FileService {
  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }
  }

  async upload(file: MultipartFile, userId: string, tenantId?: string) {
    // Validar tamanho
    if (file.file.bytesRead > MAX_FILE_SIZE) {
      throw new Error(`Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Validar tipo
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new Error(`Tipo de arquivo não permitido: ${file.mimetype}`);
    }

    // Gerar nome único
    const ext = path.extname(file.filename);
    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Salvar arquivo
    const buffer = await file.toBuffer();
    await writeFile(filepath, buffer);

    // Criar registro no banco
    const fileRecord = await prisma.file.create({
      data: {
        filename,
        originalName: file.filename,
        mimeType: file.mimetype,
        size: buffer.length,
        path: filepath,
        url: `/uploads/${filename}`,
        userId,
        tenantId,
      },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        url: true,
        createdAt: true,
      },
    });

    return fileRecord;
  }

  async getById(id: string, userId: string) {
    const file = await prisma.file.findFirst({
      where: {
        id,
        userId, // Só pode acessar próprios arquivos
        deletedAt: null,
      },
    });

    if (!file) {
      throw new Error('Arquivo não encontrado');
    }

    return file;
  }

  async list(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          url: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.file.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async delete(id: string, userId: string) {
    const file = await this.getById(id, userId);

    // Soft delete no banco
    await prisma.file.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Deletar arquivo físico
    try {
      await unlink(file.path);
    } catch (error) {
      console.warn('Erro ao deletar arquivo físico:', error);
    }

    return { message: 'Arquivo deletado com sucesso' };
  }
}

export const fileService = new FileService();
