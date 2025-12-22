# TypeScript Errors Analysis - Component Fixes

## CATEGORIA 1: Interface extends incorrectly (9 erros)

### Problema

Interfaces que estendem HTMLAttributes mas têm propriedades conflitantes com tipos diferentes.

### Erros:

1. **Autocomplete** (linha 10): extends Omit<InputHTMLAttributes, "onChange" | "value">
   - Causa: Ainda tem conflitos mesmo com Omit
2. **DatePicker** (linha 5): extends Omit<InputHTMLAttributes, "onChange" | "value">
   - Causa: Mesma que Autocomplete

3. **ImageList** (linha 85): extends Omit<HTMLAttributes, "onChange" | "onScroll">
   - Causa: Propriedades adicionais conflitando

4. **Pagination** (linha 6): extends HTMLAttributes<HTMLElement>
   - Causa: Propriedades customizadas conflitando

5. **Select** (linha 5): extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">
   - Causa: onChange ainda conflita

6. **Slider** (linha 4): extends Omit<InputHTMLAttributes, "size">
   - Causa: size ainda conflita

7. **ToggleButtonGroup** (linha 98): extends HTMLAttributes<HTMLDivElement>
   - Causa: Propriedades customizadas conflitando

## CATEGORIA 2: VariantProps conflicts (2 erros)

8. **ButtonGroup** (linha 41): cannot simultaneously extend HTMLAttributes and VariantProps
   - Causa: class-variance-authority VariantProps tem propriedades que conflitam com HTMLAttributes

9. **Chip** (linha 64): cannot simultaneously extend HTMLAttributes and VariantProps
   - Causa: Mesma que ButtonGroup

## CATEGORIA 3: Type mismatches (9 erros)

10. **ButtonGroup** (linha 75): Type 'string' not assignable to color union
    - Causa: Está passando string genérica onde espera tipo específico

11. **Chip** (linha 116): Type 'string' not assignable to color union
    - Causa: Mesma que ButtonGroup

12. **ClickAwayListener** (linha 80): No overload matches
    - Causa: Argumentos incorretos para useEffect ou addEventListener

13. **List** (linha 99): MouseEventHandler<HTMLLIElement> not assignable to intersection type
    - Causa: onClick espera tipo que funcione tanto para button quanto li

14. **Radio** (linha 162): child.props is of type 'unknown'
    - Causa: React.Children não tem tipagem adequada para props

15. **TextField** (linha 144): Type not assignable to TextareaHTMLAttributes
    - Causa: Spread de props com tipos incompatíveis

16. **ToggleButton** (linha 84): Type 'null' cannot be used as index type
    - Causa: Tentando usar null como chave de objeto

17. **ToggleButton** (linha 186,187): child.props is of type 'unknown'
    - Causa: Mesma que Radio

18. **Tooltip** (linha 93): Expected 1 arguments, but got 0
    - Causa: Função sendo chamada sem argumentos necessários

19. **Tooltip** (linha 124): No overload matches
    - Causa: Argumentos incorretos

## SOLUÇÃO SISTEMÁTICA

Vou resolver na ordem:

1. Primeiro os "interface extends" - adicionar mais Omits
2. Depois VariantProps - usar intersection type corretamente
3. Por último type mismatches - corrigir tipos específicos
