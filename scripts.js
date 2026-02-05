let chaveIA = "groq-api-Key"

async function btnInput() {
  let cidade = document.querySelector("input").value
  let caixa = document.querySelector(".caixa-media")
  let chave = "chave-openweathermap-key"
  
  let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_BR`
  
  let respostaServidor = await fetch(endereco)
  
  let dados = await respostaServidor.json()
  
  caixa.innerHTML = `
  <h2 class="cidade">${dados.name}</h2>
  <p class="temp">${Math.floor(dados.main.temp)}°C</p>
  <img class="icone" src="https://api.openweathermap.org/img/wn/${dados.weather[0].icon}.png" alt="">
  <p class="umidade"> Umidade ${dados.main.humidity}%</p>
  <button onclick="sugetaoRoupa()" class="botao-ia">Sugestão de Roupa</button>
  <p class="resposta-ia">Resposta da IA</p>
  
  `
}

function detectaVoz() {
  let reconhecimento = new window.webkitSpeechRecognition()
  reconhecimento.lang = "pt.br"
  reconhecimento.start()
  
  reconhecimento.onresult = function(evento) {
    
    let textoTranscrito = evento.results[0][0].transcript
    
    document.querySelector("input").value = textoTranscrito
    btnInput()
  }
}

async function sugetaoRoupa() {
  let temperatura = document.querySelector(".temp").textContent
  
  let umidade = document.querySelector(".umidade").textContent
  
  let cidade = document.querySelector(".cidade").textContent
  
  let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": "Bearer " + chaveIA
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
      {
        "role": "user",
        "content": `me de sugestão de qual roupa usar hoje.
        estou na cidade de: ${cidade}, a
        temperatura atual é: ${temperatura}, e a umidade está em ${umidade}.
        me de sugestão em duas frases curtas.`
      }],
    })
  })
  
  let dados = await resposta.json()
  document.querySelector(".resposta-ia").innerHTML = dados.choices[0].message.content
}
