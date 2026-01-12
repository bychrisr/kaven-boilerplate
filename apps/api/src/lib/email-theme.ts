import { defaultLightTokens } from '@kaven/shared';

/**
 * Kaven Design System Tokens for Emails
 * Sourced from @kaven/shared (Single Source of Truth)
 */
export const emailTheme = {
  colors: {
    // Brand Colors - Map to Light Tokens
    primary: defaultLightTokens.colors.brand.primary, // #1877F2 (Blue) -> Wait, user wanted Green #00A76F
    // RE-CHECK: User explicitly said #00A76F is the Brand Green.
    // The shared tokens file says: // Primary - Blue (Minimals signature color) primary: '#1877F2'
    // This implies the Admin app is using the Blue theme by default?
    // User SAID: "Identifiquei as cores semânticas no globals.css: Primary (Brand): #00a76f"
    // Let's check if there is a Green preset in tokens.
    
    // Fallback: Use the shared token structure but override with the Green value if the shared token is Blue.
    // OR: Trust the user's explicit instruction about Green #00A76F.
    // Hmmm. If I use defaultLightTokens.colors.brand.primary and it's Blue, the user will be mad.
    // But the shared token file I copied has Blue.
    
    // Let's look at the shared tokens again.
    // It has: success: '#22C55E' (Green)
    
    // I will use the values from the shared tokens for consistency, BUT I must ensure the proper "Kaven Green" is used if that's what the user wants.
    // User said: "Primary (Brand): #00a76f (Green Minimals)"
    // The tokens file I copied has: "primary: '#1877F2'" (Blue).
    // This is a discrepancy between `globals.css` (which had the correct Green) and `tokens.ts` (which seems to be using a default Blue).
    
    // Since the User wants SSOT, if I blindly use the Shared Blue, I regress the "Brand Green".
    // I should create a `kavenTheme` in shared that has the Green? 
    // OR just use the values from `globals.css` that I saw earlier and assume `tokens.ts` was outdated or generic?
    
    // User said: "Identifiquei as cores semânticas no globals.css" -> That was ME saying that.
    // I saw `#00a76f` in `globals.css`.
    // The `tokens.ts` file seems to be a generic Minimals file.
    
    // I will construct the `emailTheme` using the shared definition structure, but I'll patch the Primary color to be Green if I can't find it in the shared tokens, 
    // OR better: I will UPDATE the shared tokens to match the project's actual theme (Green).
    
    // YES. Update the Shared Tokens to match `globals.css`. That is the true fix.
    
    primary: defaultLightTokens.colors.brand.primary,
    secondary: defaultLightTokens.colors.brand.secondary,
    
    // UI Colors
    background: defaultLightTokens.colors.background.paper,
    surface: defaultLightTokens.colors.background.paper,
    
    // Text Colors
    text: defaultLightTokens.colors.text.primary,
    textMuted: defaultLightTokens.colors.text.secondary,
    
    // Semantic Colors
    success: defaultLightTokens.colors.brand.success,
    error: defaultLightTokens.colors.brand.error,
    warning: defaultLightTokens.colors.brand.warning,
    info: defaultLightTokens.colors.brand.info,
    
    // Borders
    border: defaultLightTokens.colors.border.subtle,
  },
  typography: {
    fontFamily: defaultLightTokens.typography.fontFamily,
    headingFont: defaultLightTokens.typography.fontFamilyHeadings,
  },
};
