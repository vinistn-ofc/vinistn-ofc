// ==============================
// WEATHER SITE - ARQUITETURA PROFISSIONAL COM IBGE + OPENWEATHER
// ==============================

// Configuração da API
const API_KEY = 'demo_key'; // Substitua com sua chave real da OpenWeatherMap
const WEATHER_API = 'https://api.openweathermap.org/data/2.5';

// APIs do IBGE (100% gratuitas)
const IBGE_ESTADOS_API = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
const IBGE_MUNICIPIOS_API = (uf) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;

// Cache inteligente para economizar chamadas
const cache = {
    estados: null,
    municipios: {},
    weather: {},
    lastUpdate: {}
};

// Elementos do DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContent = document.getElementById('weatherContent');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const autocompleteList = document.getElementById('autocompleteList');
const initialLoading = document.getElementById('initialLoading');
const estadoSelect = document.getElementById('estadoSelect');
const cidadeSelect = document.getElementById('cidadeSelect');

// Elementos de exibição
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const locationElement = document.getElementById('location');
const lastUpdate = document.getElementById('lastUpdate');

// Mapeamento de ícones do OpenWeather
const iconMap = {
    '01d': 'fas fa-sun', '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun', '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud', '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud', '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-showers-heavy', '09n': 'fas fa-cloud-showers-heavy',
    '10d': 'fas fa-cloud-sun-rain', '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt', '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake', '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog', '50n': 'fas fa-smog'
};

// Coordenadas simuladas para cidades principais (fallback)
const coordenadasSimuladas = {
    'São Paulo': { lat: -23.5505, lon: -46.6333 },
    'Rio de Janeiro': { lat: -22.9068, lon: -43.1729 },
    'Brasília': { lat: -15.8267, lon: -47.9218 },
    'Salvador': { lat: -12.9714, lon: -38.5014 },
    'Fortaleza': { lat: -3.7319, lon: -38.5267 },
    'Belo Horizonte': { lat: -19.9167, lon: -43.9345 },
    'Manaus': { lat: -3.1190, lon: -60.0217 },
    'Curitiba': { lat: -25.4284, lon: -49.2733 },
    'Recife': { lat: -8.0476, lon: -34.8770 },
    'Porto Alegre': { lat: -30.0346, lon: -51.2177 },
    'Aracaju': { lat: -10.9095, lon: -37.0747 },
    'Maceió': { lat: -9.6658, lon: -35.7353 },
    'Natal': { lat: -5.7945, lon: -35.2697 },
    'João Pessoa': { lat: -7.1195, lon: -34.8453 },
    'Teresina': { lat: -5.0892, lon: -42.8019 },
    'São Luís': { lat: -2.5297, lon: -44.3028 },
    'Goiânia': { lat: -16.6864, lon: -49.2643 },
    'Cuiabá': { lat: -15.6014, lon: -56.0979 },
    'Campo Grande': { lat: -20.4697, lon: -54.6201 },
    'Vitória': { lat: -20.3197, lon: -40.3373 },
    'Belém': { lat: -1.4558, lon: -48.4902 },
    'Porto Velho': { lat: -8.7612, lon: -63.9004 },
    'Rio Branco': { lat: -9.9747, lon: -67.8203 },
    'Macapá': { lat: 0.0349, lon: -51.0694 },
    'Palmas': { lat: -10.1845, lon: -48.3338 },
    'Boa Vista': { lat: 2.8195, lon: -60.6733 },
    'Florianópolis': { lat: -27.5954, lon: -48.5480 }
};

// ==============================
// FUNÇÕES DO IBGE (100% GRATUITAS)
// ==============================

// 1️⃣ Buscar todos os estados brasileiros
async function buscarEstadosIBGE() {
    if (cache.estados) {
        return cache.estados;
    }
    
    try {
        console.log('🌍 Buscando estados do IBGE...');
        const response = await fetch(IBGE_ESTADOS_API);
        const estados = await response.json();
        
        cache.estados = estados.map(estado => ({
            id: estado.id,
            sigla: estado.sigla,
            nome: estado.nome
        }));
        
        console.log(`✅ ${cache.estados.length} estados carregados`);
        return cache.estados;
    } catch (error) {
        console.error('❌ Erro ao buscar estados:', error);
        return [];
    }
}

// 2️⃣ Buscar municípios de um estado específico
async function buscarMunicipiosIBGE(uf) {
    if (cache.municipios[uf]) {
        return cache.municipios[uf];
    }
    
    try {
        console.log(`🏙️ Buscando municípios de ${uf}...`);
        const response = await fetch(IBGE_MUNICIPIOS_API(uf));
        const municipios = await response.json();
        
        cache.municipios[uf] = municipios.map(municipio => ({
            id: municipio.id,
            nome: municipio.nome,
            estado: uf
        }));
        
        console.log(`✅ ${cache.municipios[uf].length} municípios de ${uf} carregados`);
        return cache.municipios[uf];
    } catch (error) {
        console.error(`❌ Erro ao buscar municípios de ${uf}:`, error);
        return [];
    }
}

// ==============================
// FUNÇÕES DO OPENWEATHER
// ==============================

// 3️⃣ Buscar coordenadas de uma cidade
async function buscarCoordenadasCidade(cidadeNome, uf) {
    try {
        console.log(`📍 Buscando coordenadas para: ${cidadeNome}, ${uf}`);
        
        if (API_KEY !== 'demo_key') {
            // API real do OpenWeather
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cidadeNome)},${uf},BR&limit=1&appid=${API_KEY}`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    console.log(`✅ Coordenadas encontradas: ${data[0].lat}, ${data[0].lon}`);
                    return {
                        lat: data[0].lat,
                        lon: data[0].lon
                    };
                }
            }
        }
        
        // Fallback para coordenadas simuladas
        const coords = coordenadasSimuladas[cidadeNome];
        if (coords) {
            console.log(`📍 Usando coordenadas simuladas para ${cidadeNome}`);
            return coords;
        }
        
        // Coordenada padrão (Aracaju)
        console.log('📍 Usando coordenadas padrão');
        return { lat: -10.9095, lon: -37.0747 };
        
    } catch (error) {
        console.error('❌ Erro ao buscar coordenadas:', error);
        return { lat: -10.9095, lon: -37.0747 };
    }
}

// 4️⃣ Buscar clima por coordenadas (com cache de 10 minutos)
async function buscarClimaPorCoordenadas(lat, lon, cidadeNome) {
    const cacheKey = `${lat},${lon}`;
    
    // Verificar cache (10 minutos)
    if (cache.weather[cacheKey] && cache.lastUpdate[cacheKey]) {
        const agora = new Date().getTime();
        const ultimaAtualizacao = cache.lastUpdate[cacheKey].getTime();
        const diferenca = agora - ultimaAtualizacao;
        
        if (diferenca < 600000) { // 10 minutos
            console.log(`⚡ Usando cache para clima de ${cidadeNome}`);
            return cache.weather[cacheKey];
        }
    }
    
    try {
        console.log(`🌤️ Buscando clima para: ${cidadeNome} (${lat}, ${lon})`);
        
        if (API_KEY !== 'demo_key') {
            // API real do OpenWeather
            const response = await fetch(
                `${WEATHER_API}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=pt_br&units=metric`
            );
            
            if (response.ok) {
                const data = await response.json();
                
                const weatherData = {
                    nome: cidadeNome,
                    temp: data.main.temp,
                    feels_like: data.main.feels_like,
                    description: data.weather[0].description,
                    icon: data.weather[0].icon,
                    humidity: data.main.humidity,
                    wind_speed: data.wind.speed,
                    pressure: data.main.pressure,
                    lat: lat,
                    lon: lon
                };
                
                // Salvar no cache
                cache.weather[cacheKey] = weatherData;
                cache.lastUpdate[cacheKey] = new Date();
                
                console.log(`✅ Clima de ${cidadeNome}: ${weatherData.temp}°C`);
                return weatherData;
            }
        }
        
        // Fallback para dados simulados
        const weatherData = {
            nome: cidadeNome,
            temp: Math.floor(Math.random() * 15) + 20,
            feels_like: Math.floor(Math.random() * 15) + 22,
            description: ['céu limpo', 'algumas nuvens', 'nublado'][Math.floor(Math.random() * 3)],
            icon: '01d',
            humidity: Math.floor(Math.random() * 30) + 50,
            wind_speed: Math.floor(Math.random() * 20) + 5,
            pressure: Math.floor(Math.random() * 20) + 1000,
            lat: lat,
            lon: lon
        };
        
        console.log(`🎲 Usando dados simulados para ${cidadeNome}: ${weatherData.temp}°C`);
        return weatherData;
        
    } catch (error) {
        console.error('❌ Erro ao buscar clima:', error);
        throw error;
    }
}

// ==============================
// FUNÇÕES DE INTERFACE
// ==============================

// Função para mostrar loading
function showLoading() {
    console.log('⏳ Mostrando loading...');
    loading.style.display = 'block';
    weatherContent.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Função para esconder loading
function hideLoading() {
    console.log('✅ Escondendo loading...');
    loading.style.display = 'none';
}

// Função para mostrar erro
function showError(msg) {
    console.log('❌ Mostrando erro:', msg);
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
    weatherContent.style.display = 'none';
    hideLoading();
}

// Função para exibir dados do clima
function displayWeather(data) {
    console.log('📊 Exibindo dados do clima para:', data.nome);
    
    // Atualizar informações principais
    cityName.textContent = data.nome;
    temperature.textContent = Math.round(data.temp);
    weatherDescription.textContent = data.description;
    
    // Atualizar ícone
    const iconClass = iconMap[data.icon] || 'fas fa-sun';
    weatherIcon.className = iconClass;
    
    // Atualizar detalhes
    feelsLike.textContent = `${Math.round(data.feels_like)}°C`;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.wind_speed} km/h`;
    pressure.textContent = `${data.pressure} hPa`;
    locationElement.textContent = data.nome;
    
    // Atualizar hora
    const now = new Date();
    lastUpdate.textContent = `Atualizado há ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Mostrar conteúdo
    weatherContent.style.display = 'block';
    hideLoading();
    errorMessage.style.display = 'none';
}

// ==============================
// FUNÇÃO PRINCIPAL - FLUXO COMPLETO
// ==============================

// Função principal para buscar clima (fluxo completo)
async function getWeather(cidadeNome, uf) {
    console.log(`🚀 Iniciando busca de clima para: ${cidadeNome}, ${uf}`);
    showLoading();
    
    try {
        // 1️⃣ Buscar coordenadas da cidade
        const coords = await buscarCoordenadasCidade(cidadeNome, uf);
        
        // 2️⃣ Buscar clima por coordenadas
        const weatherData = await buscarClimaPorCoordenadas(coords.lat, coords.lon, cidadeNome);
        
        // 3️⃣ Exibir dados
        displayWeather(weatherData);
        
    } catch (error) {
        console.error('❌ Erro ao buscar clima:', error);
        showError('Não foi possível obter dados meteorológicos. Tente novamente.');
    }
}

// ==============================
// FUNÇÕES DE AUTOCOMPLETE
// ==============================

// Função para autocomplete de cidades
async function filterCities(query) {
    if (!query || query.length < 2) {
        autocompleteList.style.display = 'none';
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    try {
        // Buscar cidades de todos os estados no cache
        let todasCidades = [];
        for (const uf in cache.municipios) {
            const cidades = cache.municipios[uf];
            const filtradas = cidades.filter(cidade => 
                cidade.nome.toLowerCase().includes(lowerQuery)
            );
            todasCidades.push(...filtradas.slice(0, 3)); // Limitar para não sobrecarregar
        }
        
        if (todasCidades.length === 0) {
            autocompleteList.style.display = 'none';
            return;
        }
        
        // Limitar a 8 resultados
        const limited = todasCidades.slice(0, 8);
        
        // Criar HTML
        autocompleteList.innerHTML = limited.map(cidade => `
            <div class="autocomplete-item" data-cidade="${cidade.nome}" data-uf="${cidade.estado}">
                <span>${cidade.nome}, ${cidade.estado}</span>
                <i class="fas fa-map-marker-alt"></i>
            </div>
        `).join('');
        
        autocompleteList.style.display = 'block';
        
    } catch (error) {
        console.error('❌ Erro no autocomplete:', error);
        autocompleteList.style.display = 'none';
    }
}

// ==============================
// INICIALIZAÇÃO DA INTERFACE
// ==============================

// Preencher select de estados
async function preencherEstados() {
    const estados = await buscarEstadosIBGE();
    
    estadoSelect.innerHTML = '<option value="">Selecione um estado...</option>';
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.sigla;
        option.textContent = `${estado.nome} (${estado.sigla})`;
        estadoSelect.appendChild(option);
    });
}

// Preencher select de cidades quando estado for selecionado
async function preencherCidades(uf) {
    if (!uf) {
        cidadeSelect.innerHTML = '<option value="">Selecione um estado primeiro...</option>';
        return;
    }
    
    const municipios = await buscarMunicipiosIBGE(uf);
    
    cidadeSelect.innerHTML = '<option value="">Selecione uma cidade...</option>';
    municipios.forEach(municipio => {
        const option = document.createElement('option');
        option.value = municipio.nome;
        option.textContent = municipio.nome;
        cidadeSelect.appendChild(option);
    });
}

// ==============================
// EVENT LISTENERS
// ==============================

// Event listener para mudança de estado
estadoSelect.addEventListener('change', async (e) => {
    const uf = e.target.value;
    await preencherCidades(uf);
});

// Event listener para mudança de cidade
cidadeSelect.addEventListener('change', async (e) => {
    const cidadeNome = e.target.value;
    const uf = estadoSelect.value;
    
    if (cidadeNome && uf) {
        await getWeather(cidadeNome, uf);
    }
});

// Event listener para busca manual
searchBtn.addEventListener('click', async () => {
    const cidade = cityInput.value.trim();
    if (cidade) {
        // Tentar extrair UF da busca manual
        const partes = cidade.split(',');
        const cidadeNome = partes[0].trim();
        const uf = partes[1] ? partes[1].trim() : '';
        
        await getWeather(cidadeNome, uf);
        autocompleteList.style.display = 'none';
    }
});

// Event listener para Enter no input
cityInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const cidade = cityInput.value.trim();
        if (cidade) {
            const partes = cidade.split(',');
            const cidadeNome = partes[0].trim();
            const uf = partes[1] ? partes[1].trim() : '';
            
            await getWeather(cidadeNome, uf);
            autocompleteList.style.display = 'none';
        }
    }
});

// Autocomplete com debounce
let debounceTimer;
cityInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    
    debounceTimer = setTimeout(async () => {
        await filterCities(query);
    }, 300);
});

// Event listener para clique no autocomplete
autocompleteList.addEventListener('click', async (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (item) {
        const cidadeNome = item.dataset.cidade;
        const uf = item.dataset.uf;
        
        cityInput.value = `${cidadeNome}, ${uf}`;
        await getWeather(cidadeNome, uf);
        autocompleteList.style.display = 'none';
    }
});

// Fechar autocomplete com Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        autocompleteList.style.display = 'none';
    }
});

// Fechar autocomplete clicando fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) {
        autocompleteList.style.display = 'none';
    }
});

// ==============================
// INICIALIZAÇÃO
// ==============================

// Inicialização quando a página carregar
window.addEventListener('load', async () => {
    console.log('🚀 Weather Site iniciando...');
    
    // Esconder loading inicial
    if (initialLoading) {
        initialLoading.style.display = 'none';
        console.log('✅ Loading inicial escondido');
    }
    
    // Preencher estados
    await preencherEstados();
    
    // Focar no input
    if (cityInput) {
        cityInput.focus();
    }
    
    // Carregar clima de São Paulo como padrão
    await getWeather('São Paulo', 'SP');
    
    console.log('✅ Weather Site pronto para uso!');
});

// Também tentar esconder o loading imediatamente
if (initialLoading) {
    initialLoading.style.display = 'none';
    console.log('✅ Loading escondido imediatamente');
}
