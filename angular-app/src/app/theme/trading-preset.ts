import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

/**
 * Trading Platform Design System preset for PrimeNG.
 * Coinbase-inspired color palette – blue primary,
 * green/red for trading buy/sell actions.
 */
export const TradingPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '8px',   // shadcn uses lg (8px) for cards/modals, not 12px
    },
  },
  semantic: {
    // Shadcn-style focus ring: 2px solid ring with offset
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    // Form field base tokens (applied to inputs, selects, etc.)
    formField: {
      borderRadius: '{border.radius.md}',  // 6px
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      sm: {
        fontSize: '0.8125rem',
        paddingX: '0.625rem',
        paddingY: '0.375rem',
      },
      lg: {
        fontSize: '1rem',
        paddingX: '1rem',
        paddingY: '0.625rem',
      },
      // Inputs: highlight focus via border only, no extra ring
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: 'none',
      },
    },
    primary: {
      50:  '#ebf0ff',
      100: '#c4d4ff',
      200: '#9cb7ff',
      300: '#6993ff',
      400: '#4570ff',
      500: '#1652f0',
      600: '#0d40cc',
      700: '#0a30a3',
      800: '#072480',
      900: '#041660',
      950: '#020d40',
    },
    colorScheme: {
      dark: {
        surface: {
          0:   '#ffffff',
          50:  '#8a919e',
          100: '#6e7480',
          200: '#5b616e',
          300: '#474d57',
          400: '#3e4350',
          500: '#2a2d35',
          600: '#1e2329',
          700: '#161a1e',
          800: '#161a1e',
          900: '#10131a',
          950: '#0c0e12',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.400}',
          activeColor: '{primary.600}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.500}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.500}, transparent 76%)',
          color: 'rgba(255,255,255,0.87)',
          focusColor: 'rgba(255,255,255,0.87)',
        },
        formField: {
          background: '{surface.800}',
          disabledBackground: '{surface.700}',
          filledBackground: '{surface.800}',
          filledHoverBackground: '{surface.800}',
          filledFocusBackground: '{surface.800}',
          borderColor: '{surface.500}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '#ff637d',
          color: '{surface.0}',
          disabledColor: '{surface.300}',
          placeholderColor: '{surface.50}',
          invalidPlaceholderColor: '#ff637d',
          floatLabelColor: '{surface.50}',
          floatLabelFocusColor: '{primary.color}',
          floatLabelActiveColor: '{surface.50}',
          floatLabelInvalidColor: '#ff637d',
          iconColor: '{surface.50}',
          shadow: 'none',
        },
        text: {
          color: '{surface.0}',
          hoverColor: '{surface.0}',
          mutedColor: '{surface.50}',
          hoverMutedColor: '{surface.100}',
        },
        content: {
          background: '{surface.800}',
          hoverBackground: '{surface.700}',
          borderColor: '{surface.500}',
          color: '{surface.0}',
          hoverColor: '{surface.0}',
        },
        overlay: {
          select: {
            background: '{surface.800}',
            borderColor: '{surface.500}',
            color: '{surface.0}',
          },
          popover: {
            background: '{surface.800}',
            borderColor: '{surface.500}',
            color: '{surface.0}',
          },
          modal: {
            background: '{surface.800}',
            borderColor: '{surface.500}',
            color: '{surface.0}',
          },
        },
        navigation: {
          item: {
            focusBackground: '{surface.700}',
            activeBackground: '{surface.700}',
            color: '{text.color}',
            focusColor: '{text.hoverColor}',
            activeColor: '{text.hoverColor}',
            icon: {
              color: '{surface.50}',
              focusColor: '{surface.0}',
              activeColor: '{surface.0}',
            },
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.mutedColor}',
          },
          submenuIcon: {
            color: '{surface.50}',
            focusColor: '{surface.0}',
            activeColor: '{surface.0}',
          },
        },
      },
      light: {
        surface: {
          0:   '#ffffff',
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e8eaed',
          300: '#d1d5db',
          400: '#8a919e',
          500: '#5b616e',
          600: '#3e4350',
          700: '#2c2f36',
          800: '#1b1d21',
          900: '#0f1015',
          950: '#050f19',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.100}',
          filledBackground: '{surface.50}',
          filledHoverBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          borderColor: '{surface.200}',
          hoverBorderColor: '{surface.300}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '#cf202f',
          color: '{surface.950}',
          disabledColor: '{surface.400}',
          placeholderColor: '{surface.400}',
          floatLabelColor: '{surface.400}',
          floatLabelFocusColor: '{primary.color}',
          iconColor: '{surface.500}',
          shadow: 'none',
        },
      },
    },
  },
});
