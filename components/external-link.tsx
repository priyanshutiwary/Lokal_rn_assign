import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform, Pressable } from 'react-native';

type Props = Omit<ComponentProps<typeof Pressable>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      onPress={async (e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
