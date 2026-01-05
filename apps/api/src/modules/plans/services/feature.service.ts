import { prisma } from '../../../lib/prisma';
import type { CreateFeatureInput, UpdateFeatureInput } from '../../../lib/validation-plans';

export class FeatureService {
  /**
   * Lista todas as features
   */
  async listFeatures(filters: { isActive?: boolean; category?: string } = {}) {
    const where: any = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    const features = await prisma.feature.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    return features.map(f => this.formatFeatureResponse(f));
  }

  /**
   * Busca feature por ID
   */
  async getFeatureById(id: string) {
    const feature = await prisma.feature.findUnique({
      where: { id },
    });

    if (!feature) {
      throw new Error('Feature não encontrada');
    }

    return this.formatFeatureResponse(feature);
  }

  /**
   * Busca feature por código
   */
  async getFeatureByCode(code: string) {
    const feature = await prisma.feature.findUnique({
      where: { code },
    });

    if (!feature) {
      throw new Error('Feature não encontrada');
    }

    return this.formatFeatureResponse(feature);
  }

  /**
   * Cria nova feature
   */
  async createFeature(data: CreateFeatureInput) {
    // Verificar se código já existe
    const existing = await prisma.feature.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new Error('Já existe uma feature com este código');
    }

    const feature = await prisma.feature.create({
      data,
    });

    return this.formatFeatureResponse(feature);
  }

  /**
   * Atualiza feature existente
   */
  async updateFeature(id: string, data: UpdateFeatureInput) {
    const existing = await prisma.feature.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Feature não encontrada');
    }

    const feature = await prisma.feature.update({
      where: { id },
      data,
    });

    return this.formatFeatureResponse(feature);
  }

  /**
   * Desativa feature (soft delete)
   */
  async deleteFeature(id: string) {
    const feature = await prisma.feature.findUnique({
      where: { id },
      include: {
        planFeatures: true,
        productEffects: true,
      },
    });

    if (!feature) {
      throw new Error('Feature não encontrada');
    }

    // Avisar se feature está em uso
    if (feature.planFeatures.length > 0 || feature.productEffects.length > 0) {
      throw new Error(
        `Feature está em uso por ${feature.planFeatures.length} planos e ${feature.productEffects.length} produtos. ` +
        'Desative a feature ao invés de deletar.'
      );
    }

    // Soft delete
    await prisma.feature.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Feature desativada com sucesso' };
  }

  /**
   * Lista categorias de features
   */
  async listCategories() {
    const features = await prisma.feature.findMany({
      where: {
        category: { not: null },
        isActive: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return features
      .map(f => f.category)
      .filter(Boolean)
      .sort();
  }

  /**
   * Formata resposta de feature
   */
  private formatFeatureResponse(feature: any) {
    return {
      id: feature.id,
      code: feature.code,
      name: feature.name,
      description: feature.description,
      type: feature.type,
      defaultValue: feature.defaultValue,
      unit: feature.unit,
      category: feature.category,
      sortOrder: feature.sortOrder,
      isActive: feature.isActive,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }
}

export const featureService = new FeatureService();
