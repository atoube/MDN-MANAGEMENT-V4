import { supabase } from './supabase';

interface AssistantRequest {
  message: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export async function callMarketingAssistant(data: AssistantRequest) {
  try {
    // Simulate AI response for now
    const responses = {
      'bonjour': 'Bonjour ! Comment puis-je vous aider avec votre campagne marketing ?',
      'suggestion': 'Voici une suggestion de contenu : "Découvrez nos nouveautés exclusives ! 🌟 Profitez de -20% sur toute la nouvelle collection avec le code WELCOME20. Offre limitée, ne tardez pas !"',
      'optimisation': 'Pour optimiser votre message, pensez à :\n- Utiliser des émojis stratégiquement\n- Inclure un appel à l\'action clair\n- Créer un sentiment d\'urgence\n- Personnaliser le message',
      'help': 'Je peux vous aider à :\n- Rédiger des objets d\'email accrocheurs\n- Optimiser vos messages\n- Suggérer des appels à l\'action\n- Analyser le ton de votre message'
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const defaultResponse = "Je peux vous aider à optimiser votre message. Que souhaitez-vous améliorer ?";
    
    const matchingResponse = Object.entries(responses).find(([key]) => 
      data.message.toLowerCase().includes(key)
    );

    return {
      message: matchingResponse ? matchingResponse[1] : defaultResponse
    };
  } catch (error) {
    console.error('Error in marketing assistant:', error);
    throw new Error('Failed to get marketing assistant response');
  }
}