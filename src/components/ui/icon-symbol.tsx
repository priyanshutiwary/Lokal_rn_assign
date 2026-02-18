// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // SF Symbol -> MaterialIcon
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'play.fill': 'play-arrow',
  'ellipsis': 'more-horiz',
  'more.vertical': 'more-vert',
  'arrow.up.arrow.down': 'swap-vert',
  'square.and.arrow.up': 'ios-share',
  'arrow.right.circle': 'arrow-circle-right',
  'text.badge.plus': 'playlist-add',
  'plus.circle': 'add-circle-outline',
  'play.circle': 'play-circle-outline',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'music.note.list': 'description',
  'gear': 'settings',
  'music.note': 'music-note',
  'magnifyingglass': 'search',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
