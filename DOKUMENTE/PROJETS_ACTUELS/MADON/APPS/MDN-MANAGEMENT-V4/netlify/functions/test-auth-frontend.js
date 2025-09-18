exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;

    console.log('🔍 Test frontend - Email reçu:', email);
    console.log('🔍 Test frontend - Mot de passe reçu:', password ? '***' : 'vide');

    // Simuler une réponse de test
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Test frontend réussi',
        received: {
          email: email,
          passwordLength: password ? password.length : 0
        },
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Erreur test frontend',
        error: error.message,
      }),
    };
  }
};

