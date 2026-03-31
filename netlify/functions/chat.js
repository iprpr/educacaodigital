export async function handler(event) {

  console.log("API KEY:", process.env.OPENROUTER_API_KEY);

  try {
    const { messages } = JSON.parse(event.body);

    if (!process.env.OPENROUTER_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "API KEY não encontrada no ambiente"
        })
      };
    }

    const models = [
      "mistralai/mistral-7b-instruct",
      "openchat/openchat-7b",
      "meta-llama/llama-3-8b-instruct"
    ];

    let lastError = null;

    for (const model of models) {
      try {

        console.log("Tentando modelo:", model);

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages
          })
        });

        const data = await res.json();

        console.log("Resposta:", data);

        // ✅ sucesso real
        if (res.ok && data.choices && data.choices.length > 0) {
          return {
            statusCode: 200,
            body: JSON.stringify({
              reply: data.choices[0].message.content,
              model
            })
          };
        }

        // guarda erro
        lastError = data;

      } catch (err) {
        console.log("Erro no modelo:", model, err);
        lastError = err;
      }
    }

    // ❌ todos falharam
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Todos os modelos falharam",
        detail: lastError
      })
    };

  } catch (error) {
    console.log("Erro geral:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
}
