import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../../lib/prisma';
import { pagueBitService } from './paguebit.service';
import type { PagueBitWebhookPayload } from './paguebit.types';

/**
 * Handler para webhooks do PagueBit
 * Implementa validação HMAC, idempotência e processamento de status
 */
export async function handlePagueBitWebhook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 1. Extrair headers
    const signature = request.headers['x-paguebit-signature'] as string;
    const timestamp = request.headers['x-paguebit-timestamp'] as string;
    const eventId = request.headers['x-paguebit-event-id'] as string;

    if (!signature || !timestamp || !eventId) {
      return reply.status(400).send({ error: 'Missing required headers' });
    }

    const body = JSON.stringify(request.body);

    // 2. Validar assinatura HMAC
    const isValid = pagueBitService.validateWebhook(signature, body, timestamp);
    if (!isValid) {
      console.error('❌ Webhook signature inválida');
      return reply.status(401).send({ error: 'Invalid signature' });
    }

    // 3. Idempotência - verificar se evento já foi processado
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { externalId: eventId },
    });

    if (existingEvent) {
      console.log(`✅ Webhook ${eventId} já processado anteriormente`);
      return reply.status(200).send({ received: true, duplicate: true });
    }

    // 4. Salvar evento no banco
    await prisma.webhookEvent.create({
      data: {
        externalId: eventId,
        provider: 'PAGUEBIT',
        event: 'payment.status_changed',
        payload: request.body as any,
        processedAt: null,
      },
    });

    // 5. Processar payload
    const payload = request.body as PagueBitWebhookPayload;
    await processPaymentWebhook(payload);

    // 6. Marcar como processado
    await prisma.webhookEvent.update({
      where: { externalId: eventId },
      data: { processedAt: new Date() },
    });

    console.log(`✅ Webhook ${eventId} processado com sucesso`);
    return reply.status(200).send({ received: true });
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

/**
 * Processar mudança de status de pagamento
 */
async function processPaymentWebhook(payload: PagueBitWebhookPayload) {
  const externalId = payload.external_id;

  console.log(`📥 Processando webhook: ${payload.id} | Status: ${payload.status}`);

  switch (payload.status) {
    case 'pending':
      // Aguardando pagamento - não fazer nada
      console.log(`⏳ Pagamento ${externalId} aguardando...`);
      break;

    case 'review':
      // Em análise - NÃO confirmar ainda
      console.log(`🔍 Pagamento ${externalId} em análise...`);
      await updatePurchaseStatus(externalId, 'PENDING');
      break;

    case 'approved':
      // ✅ ÚNICO status que confirma recebimento
      console.log(`✅ Pagamento ${externalId} aprovado!`);
      await confirmPurchase(externalId, payload.id, payload.paid_at);
      break;

    case 'not_approved':
      // Rejeitado/expirado/estornado
      console.log(`❌ Pagamento ${externalId} não aprovado`);
      await cancelPurchase(externalId, 'Pagamento não aprovado');
      break;
  }
}

/**
 * Atualizar status de Purchase
 */
async function updatePurchaseStatus(
  purchaseId: string,
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
) {
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status },
  });
}

/**
 * Confirmar Purchase e aplicar efeitos
 */
async function confirmPurchase(
  purchaseId: string,
  paymentId: string,
  paidAt?: string
) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      product: {
        include: {
          effects: {
            include: {
              feature: true,
            },
          },
        },
      },
    },
  });

  if (!purchase) {
    console.error(`❌ Purchase ${purchaseId} não encontrado`);
    return;
  }

  // Atualizar purchase
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: 'COMPLETED',
      paymentId,
    },
  });

  // Aplicar efeitos do produto (se houver)
  if (purchase.product && purchase.userId) {
    for (const effect of purchase.product.effects) {
      await applyProductEffect(purchase.userId, effect);
    }
  }

  console.log(`✅ Purchase ${purchaseId} confirmado e efeitos aplicados`);
}

/**
 * Cancelar Purchase
 */
async function cancelPurchase(purchaseId: string, reason: string) {
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: 'FAILED',
      metadata: {
        cancelReason: reason,
        canceledAt: new Date().toISOString(),
      },
    },
  });
}

/**
 * Aplicar efeito de produto
 */
async function applyProductEffect(userId: string, effect: any) {
  // TODO: Implementar lógica de aplicação de efeitos
  // Exemplos:
  // - ADD_QUOTA: Adicionar quota a uma feature
  // - UNLOCK_FEATURE: Desbloquear feature
  // - SET: Definir valor absoluto
  // - MULTIPLY: Multiplicar valor atual

  console.log(`🎁 Aplicando efeito: ${effect.effectType} para feature ${effect.feature.code}`);

  // Implementação será feita quando integrarmos com sistema de features
}
