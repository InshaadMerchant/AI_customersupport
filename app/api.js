export const sendChatMessage = async (messages, apiKey) => {
    const systemMessage = {
        role: 'system',
        content: "You are a healthcare support assistant. Provide helpful and accurate responses related to healthcare queries."
    };

    const requestBody = {
        messages: [systemMessage, ...messages, { role: 'user', content: messages[messages.length - 1].content }]
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch("https://triisumbuddy.openai.azure.com/openai/deployments/triisumbuddy/chat/completions?api-version=2023-05-15", requestOptions);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};