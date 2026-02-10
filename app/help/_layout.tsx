import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function HelpLayout() {
    const { colorScheme } = useColorScheme();

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#0f172a',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
            <Stack.Screen name="index" options={{ title: 'Help & About' }} />
            <Stack.Screen name="app-info" options={{ title: 'About App' }} />
            <Stack.Screen name="guide" options={{ title: 'User Guide' }} />
            <Stack.Screen name="resources" options={{ title: 'Resources' }} />
        </Stack>
    );
}
