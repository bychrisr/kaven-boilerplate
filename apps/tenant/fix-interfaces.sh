#!/bin/bash
# Script para corrigir todos os erros de interface TypeScript

echo "Fixing all TypeScript interface errors..."

# Lista de arquivos com erros conhecidos
files=(
  "components/ui/accordion.tsx"
  "components/ui/autocomplete.tsx"
  "components/ui/bottom-navigation.tsx"
  "components/ui/date-picker.tsx"
  "components/ui/image-list.tsx"
  "components/ui/pagination.tsx"
  "components/ui/radio.tsx"
  "components/ui/select.tsx"
  "components/ui/slider.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Adiciona Omit para propriedades conflitantes comuns
    sed -i 's/extends React\.HTMLAttributes<HTMLDivElement>/extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onScroll">/g' "$file"
    sed -i 's/extends React\.InputHTMLAttributes<HTMLInputElement>/extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">/g' "$file"
  fi
done

echo "Done!"
