import React from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  ButtonIcon,
  Text,
  Heading,
  Image,
  GluestackUIProvider,
} from './index';
import { ArrowRightIcon } from './icon';

/**
 * UI Components Demo Component
 * 
 * This component demonstrates how to use all the available UI components
 * from the components/ui library.
 */
export default function UIComponentsDemo() {
  return (
    <GluestackUIProvider mode="light">
      <ScrollView className="flex-1 bg-gray-50">
        <Box className="p-6">
          {/* Header Section */}
          <Box className="mb-8">
            <Heading size="2xl" className="mb-2 text-gray-900">
              UI Components Demo
            </Heading>
            <Text className="text-gray-600 text-base">
              Explore all available components in our design system
            </Text>
          </Box>

          {/* Typography Section */}
          <Box className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="lg" className="mb-4 text-gray-800">
              Typography
            </Heading>
            
            <Heading size="xl" className="mb-2">
              Extra Large Heading
            </Heading>
            <Heading size="lg" className="mb-2">
              Large Heading
            </Heading>
            <Heading size="md" className="mb-2">
              Medium Heading
            </Heading>
            <Heading size="sm" className="mb-4">
              Small Heading
            </Heading>
            
            <Text className="mb-2 text-base">
              This is regular body text with base size.
            </Text>
            <Text className="mb-2 text-sm text-gray-600">
              This is smaller text in gray color.
            </Text>
            <Text className="text-xs text-gray-500">
              This is extra small text for captions.
            </Text>
          </Box>

          {/* Buttons Section */}
          <Box className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="lg" className="mb-4 text-gray-800">
              Buttons
            </Heading>
            
            <Box className="space-y-3">
              <Button size="lg" variant="solid" action="primary">
                <ButtonText>Large Primary Button</ButtonText>
              </Button>
              
              <Button size="md" variant="solid" action="secondary">
                <ButtonText>Medium Secondary Button</ButtonText>
              </Button>
              
              <Button size="sm" variant="outline" action="primary">
                <ButtonText>Small Outline Button</ButtonText>
              </Button>
              
              <Button size="md" variant="solid" action="primary">
                <ButtonText>Button with Icon</ButtonText>
                <ButtonIcon as={ArrowRightIcon} className="ml-2" />
              </Button>
              
              <Button size="md" variant="link" action="primary">
                <ButtonText>Link Button</ButtonText>
              </Button>
            </Box>
          </Box>

          {/* Layout Section */}
          <Box className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="lg" className="mb-4 text-gray-800">
              Layout & Containers
            </Heading>
            
            <Box className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Text className="text-blue-800">
                This is a Box component with blue background and border
              </Text>
            </Box>
            
            <Box className="mb-4 p-4 bg-green-50 rounded-lg">
              <Text className="text-green-800 mb-2">
                Nested Box Example
              </Text>
              <Box className="p-3 bg-green-100 rounded">
                <Text className="text-green-700">
                  This is a nested box inside another box
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Image Section */}
          <Box className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="lg" className="mb-4 text-gray-800">
              Images
            </Heading>
            
            <Box className="space-y-4">
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop'
                }}
                alt="Demo landscape image"
                className="w-full h-48 rounded-lg"
              />
              
              <Box className="flex-row space-x-4">
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
                  }}
                  alt="Profile image"
                  className="w-16 h-16 rounded-full"
                />
                <Box className="flex-1">
                  <Text className="font-semibold">Profile Image Example</Text>
                  <Text className="text-sm text-gray-600">
                    Circular profile image with text content
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Interactive Examples */}
          <Box className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="lg" className="mb-4 text-gray-800">
              Interactive Examples
            </Heading>
            
            <Box className="space-y-4">
              <Button 
                size="md" 
                variant="solid" 
                action="primary"
                onPress={() => console.log('Button pressed!')}
              >
                <ButtonText>Press Me</ButtonText>
              </Button>
              
              <Text className="text-sm text-gray-600">
                Check the console for button press events
              </Text>
            </Box>
          </Box>

          {/* Usage Instructions */}
          <Box className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <Heading size="md" className="mb-2 text-amber-800">
              How to Use These Components
            </Heading>
            <Text className="text-amber-700 text-sm mb-2">
              Import any component from the UI library:
            </Text>
            <Box className="p-3 bg-amber-100 rounded font-mono">
              <Text className="text-xs text-amber-800">
                {`import { Box, Button, ButtonText, Text, Heading } from '@/components/ui';`}
              </Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </GluestackUIProvider>
  );
}

/**
 * Export the demo component for use in development
 */
export { UIComponentsDemo };
