---
description: 'Kaven Phase 1 - Workflow 04: Payment System'
---

# 💳 Workflow 04: Payment System

---

## STEP 0: INICIALIZAR TELEMETRIA & WRAPPER

```bash
# Carregar utils e tracking
source .agent/scripts/utils.sh
.agent/scripts/init_telemetry.sh "04-payment-system" "Sistema de pagamentos com Stripe"

# Verificar saúde da infraestrutura (Smart Doctor)
echo "🏥 Checking infrastructure..."
if [ -f .agent/scripts/docker_doctor.py ]; then
    python3 .agent/scripts/docker_doctor.py
fi
```

---

## STEP 1: Instalar Stripe

```bash
cd apps/api
execute "pnpm add stripe"
cd ../../
```

---

## STEP 2: Stripe Service

```bash
cat > apps/api/src/modules/payments/stripe.service.ts << 'EOF'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class StripeService {
  async createCustomer(email: string) {
    return stripe.customers.create({ email });
  }
}
EOF

echo "apps/api/src/modules/payments/stripe.service.ts" >> .agent/telemetry/files_tracker.txt
```

---

## STEP 3: Git Commit

```bash
execute "git add ."
execute "git commit -m 'feat: sistema de pagamentos com Stripe

Workflow: 04-payment-system
'"
```

---

## STEP 4: FINALIZAR TELEMETRIA

```bash
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh 04-payment-system
```
