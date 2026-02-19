import React, { useState } from 'react';
import { Image, View, ImageProps } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FallbackImageProps extends Omit<ImageProps, 'source'> {
  uri?: string;
  fallbackIcon?: string;
  rounded?: boolean;
  size?: number;
}

export function FallbackImage({ 
  uri, 
  fallbackIcon = 'music.note',
  rounded = false,
  size,
  style,
  ...props 
}: FallbackImageProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showPlaceholder = !uri || imageError || uri.includes('placeholder');

  if (showPlaceholder) {
    return (
      <View 
        style={[
          {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
            justifyContent: 'center',
            alignItems: 'center',
            ...(rounded && { borderRadius: 9999 }),
            ...(size && { width: size, height: size }),
          },
          style
        ]}
      >
        <IconSymbol 
          name={fallbackIcon} 
          size={size ? size * 0.4 : 32} 
          color="#FF9500" 
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      onError={() => setImageError(true)}
      onLoadStart={() => setIsLoading(true)}
      onLoadEnd={() => setIsLoading(false)}
      style={style}
      {...props}
    />
  );
}
