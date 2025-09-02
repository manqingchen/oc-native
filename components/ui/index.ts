// ============================================================================
// UI Components Index - Auto-generated exports for all UI components
// ============================================================================

// Layout Components
export * from "./box";

// Interactive Components
export * from "./button";

// Typography Components
export * from "./heading";
export * from "./text";

// Media Components
export * from "./image";

// Icon Components
export * from "./icon";

// Provider Components
export * from "./gluestack-ui-provider";

export * from './center';

export * from './pressable';

export * from './input';

export * from './toast';

export * from './modal'

export * from './popover'

// ============================================================================
// Component Demo Examples
// ============================================================================

/**
 * UI Components Demo
 *
 * This file demonstrates how to use all the available UI components.
 * Import any component you need from this index file:
 *
 * @example
 * ```tsx
 * import {
 *   Box,
 *   Button, ButtonText, ButtonIcon,
 *   Text,
 *   Heading,
 *   Image,
 *   GluestackUIProvider
 * } from '@/components/ui';
 *
 * export default function MyComponent() {
 *   return (
 *     <GluestackUIProvider mode="light">
 *       <Box className="p-4 bg-white">
 *         <Heading size="xl" className="mb-4">
 *           Welcome to UI Components
 *         </Heading>
 *
 *         <Text className="mb-4 text-gray-600">
 *           This is a demo of our UI component library.
 *         </Text>
 *
 *         <Button
 *           size="md"
 *           variant="solid"
 *           action="primary"
 *           className="mb-4"
 *         >
 *           <ButtonText>Click Me</ButtonText>
 *           <ButtonIcon as={ArrowRightIcon} className="ml-2" />
 *         </Button>
 *
 *         <Image
 *           source={{ uri: 'https://example.com/image.jpg' }}
 *           alt="Demo Image"
 *           className="w-full h-48 rounded-lg"
 *         />
 *       </Box>
 *     </GluestackUIProvider>
 *   );
 * }
 * ```
 */

// ============================================================================
// Available Components Summary
// ============================================================================

/**
 * Layout Components:
 * - Box: Flexible container component with styling variants
 *
 * Interactive Components:
 * - Button: Primary action button with multiple variants
 * - ButtonText: Text content for buttons
 * - ButtonIcon: Icon content for buttons
 * - ButtonSpinner: Loading spinner for buttons
 * - ButtonGroup: Group multiple buttons together
 *
 * Typography Components:
 * - Text: Basic text component with styling options
 * - Heading: Heading component with size variants
 *
 * Media Components:
 * - Image: Optimized image component
 *
 * Icon Components:
 * - Icon: Flexible icon component
 *
 * Provider Components:
 * - GluestackUIProvider: Theme and configuration provider
 */

// ============================================================================
// Type Exports (for TypeScript users)
// ============================================================================

// Re-export common types that might be useful
export type { VariantProps } from '@gluestack-ui/nativewind-utils';

// ============================================================================
// Demo Component Export
// ============================================================================

// Export the demo component for development and testing
// export { default as UIComponentsDemo } from './demo';
