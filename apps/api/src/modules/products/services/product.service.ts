import { prisma } from '../../../lib/prisma';
import type { CreateProductInput, UpdateProductInput, ListProductsInput } from '../../../lib/validation-plans';

export class ProductService {
  /**
   * Lista produtos com filtros opcionais
   */
  async listProducts(filters: ListProductsInput = {}) {
    const where: any = {};

    if (filters.tenantId !== undefined) {
      where.tenantId = filters.tenantId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        effects: {
          include: {
            feature: true,
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return products.map(product => this.formatProductResponse(product));
  }

  /**
   * Busca produto por ID
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        effects: {
          include: {
            feature: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return this.formatProductResponse(product);
  }

  /**
   * Busca produto por código
   */
  async getProductByCode(code: string, tenantId?: string | null) {
    const product = await prisma.product.findFirst({
      where: {
        code,
        tenantId: tenantId ?? null,
      },
      include: {
        effects: {
          include: {
            feature: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return this.formatProductResponse(product);
  }

  /**
   * Cria novo produto
   */
  async createProduct(data: CreateProductInput) {
    // Verificar se código já existe para este tenant
    const existing = await prisma.product.findFirst({
      where: {
        code: data.code,
        tenantId: data.tenantId ?? null,
      },
    });

    if (existing) {
      throw new Error('Já existe um produto com este código');
    }

    // Extrair effects do input
    const { effects, ...productData } = data;

    // Criar produto
    const product = await prisma.product.create({
      data: productData,
    });

    // Adicionar effects
    if (effects && effects.length > 0) {
      await this.addEffectsToProduct(product.id, effects);
    }

    // Retornar produto completo
    return this.getProductById(product.id);
  }

  /**
   * Atualiza produto existente
   */
  async updateProduct(id: string, data: UpdateProductInput) {
    // Verificar se produto existe
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Produto não encontrado');
    }

    // Atualizar produto
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return this.getProductById(product.id);
  }

  /**
   * Desativa produto (soft delete)
   */
  async deleteProduct(id: string) {
    // Verificar se produto existe
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    // Soft delete (desativar)
    await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
        isPublic: false,
      },
    });

    return { message: 'Produto desativado com sucesso' };
  }

  /**
   * Adiciona effects a um produto
   */
  async addEffectsToProduct(
    productId: string,
    effects: Array<{
      featureCode: string;
      effectType?: 'ADD' | 'SET' | 'MULTIPLY' | 'ENABLE';
      value?: number;
      isPermanent?: boolean;
      durationDays?: number;
    }>
  ) {
    // Buscar features por código
    const featureCodes = effects.map(e => e.featureCode);
    const dbFeatures = await prisma.feature.findMany({
      where: {
        code: { in: featureCodes },
        isActive: true,
      },
    });

    if (dbFeatures.length !== featureCodes.length) {
      const foundCodes = dbFeatures.map(f => f.code);
      const missing = featureCodes.filter(c => !foundCodes.includes(c));
      throw new Error(`Features não encontradas: ${missing.join(', ')}`);
    }

    // Criar ProductEffects
    const productEffects = effects.map(e => {
      const feature = dbFeatures.find(dbF => dbF.code === e.featureCode)!;
      return {
        productId,
        featureId: feature.id,
        effectType: e.effectType || 'ADD',
        value: e.value,
        isPermanent: e.isPermanent ?? false,
        durationDays: e.durationDays,
      };
    });

    await prisma.productEffect.createMany({
      data: productEffects,
      skipDuplicates: true,
    });
  }

  /**
   * Atualiza effect de um produto
   */
  async updateProductEffect(
    productId: string,
    featureCode: string,
    data: {
      effectType?: 'ADD' | 'SET' | 'MULTIPLY' | 'ENABLE';
      value?: number;
      isPermanent?: boolean;
      durationDays?: number;
    }
  ) {
    // Buscar feature
    const feature = await prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature) {
      throw new Error('Feature não encontrada');
    }

    // Atualizar ProductEffect
    await prisma.productEffect.update({
      where: {
        productId_featureId: {
          productId,
          featureId: feature.id,
        },
      },
      data,
    });

    return this.getProductById(productId);
  }

  /**
   * Remove effect de um produto
   */
  async removeProductEffect(productId: string, featureCode: string) {
    const feature = await prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature) {
      throw new Error('Feature não encontrada');
    }

    await prisma.productEffect.delete({
      where: {
        productId_featureId: {
          productId,
          featureId: feature.id,
        },
      },
    });

    return { message: 'Effect removido do produto' };
  }

  /**
   * Formata resposta do produto para API
   */
  private formatProductResponse(product: any) {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      type: product.type,
      price: Number(product.price),
      currency: product.currency,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      isActive: product.isActive,
      isPublic: product.isPublic,
      sortOrder: product.sortOrder,
      stock: product.stock,
      maxPerTenant: product.maxPerTenant,
      stripeProductId: product.stripeProductId,
      stripePriceId: product.stripePriceId,
      imageUrl: product.imageUrl,
      tenantId: product.tenantId,
      metadata: product.metadata,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      effects: product.effects?.map((pe: any) => ({
        featureCode: pe.feature.code,
        featureName: pe.feature.name,
        featureType: pe.feature.type,
        featureUnit: pe.feature.unit,
        effectType: pe.effectType,
        value: pe.value,
        isPermanent: pe.isPermanent,
        durationDays: pe.durationDays,
      })) || [],
    };
  }
}

export const productService = new ProductService();
