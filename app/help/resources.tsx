import { ExternalLink } from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ResourcesScreen() {

    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    const ResourceCard = ({ title, description, url, source }: { title: string, description: string, url: string, source: string }) => (
        <TouchableOpacity
            onPress={() => openLink(url)}
            className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl mb-4 border border-slate-200 dark:border-slate-700 active:bg-slate-100 dark:active:bg-slate-700"
        >
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-xs font-bold text-blue-500 uppercase tracking-wider">{source}</Text>
                <ExternalLink size={16} color="#64748b" />
            </View>
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</Text>
            <Text className="text-slate-600 dark:text-slate-300 leading-5 text-sm">{description}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView className="flex-1 bg-white dark:bg-slate-900 p-6">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Health Resources</Text>
            <Text className="text-slate-500 dark:text-slate-400 mb-8">Trusted information from medical professionals.</Text>

            <ResourceCard
                source="Mayo Clinic"
                title="Intermittent Fasting: What is it?"
                description="Learn about the different methods, potential benefits, and safety considerations of intermittent fasting from a leading medical authority."
                url="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/expert-answers/intermittent-fasting/faq-20449627"
            />

            <ResourceCard
                source="CDC"
                title="Water and Healthier Drinks"
                description="Understand why water is the best choice for hydration and tips for drinking more of it daily to improve your health."
                url="https://www.cdc.gov/healthywater/drinking/nutrition/index.html"
            />

            <Text className="text-slate-400 text-xs text-center mt-8 px-4">
                Disclaimer: The information provided in this app is for educational purposes only and is not intended as medical advice.
            </Text>
        </ScrollView>
    );
}
