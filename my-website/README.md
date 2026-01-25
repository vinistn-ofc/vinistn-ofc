# Meu Portfólio

Um site de portfólio pessoal moderno e profissional criado com HTML, CSS e JavaScript puro, projetado para desenvolvedores web showcase de habilidades e projetos.

## 🚀 Funcionalidades Implementadas

### ✨ Design e Interface
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Interface Moderna**: Design limpo com gradientes e sombras suaves
- **Cores Profissionais**: Paleta de cores moderna com gradientes
- **Icones Reais**: Font Awesome para ícones profissionais nas cores originais

### 🎯 Seções Completas

#### **Hero Section**
- Animação de digitação para o título
- Efeito parallax ao rolar
- Interação com mouse (efeito 3D)
- Botões com call-to-action

#### **Sobre Mim**
- Espaço para informações profissionais
- Estatísticas animadas (anos de carreira, projetos, clientes)
- Cards com informações de contato
- Design moderno com hover effects

#### **Tecnologias & Habilidades**
- **Categorizadas por área**:
  - Frontend (HTML, CSS, JavaScript, React, Vue.js, Sass)
  - Backend (Node.js, Python, Banco de Dados)
  - Ferramentas (Git, Docker, VS Code)
- **Barras de progresso animadas**
- **Ícones com cores originais das tecnologias**
- **Cards interativos com hover effects**

#### **Projetos em Destaque**
- **Sistema de filtro** por categoria (Frontend, Full Stack, Mobile)
- **Cards com imagens reais** (placeholder personalizado)
- **Informações detalhadas**: nome, descrição, tecnologias
- **Botões funcionais**: Preview (abre em nova aba) e Código (GitHub)
- **Overlay com tecnologias** ao hover
- **Animações suaves** de entrada e saída

#### **Contato**
- **Informações completas**: email, telefone, localização
- **Redes sociais profissionais**:
  - GitHub (vinistn-oficial)
  - LinkedIn
  - Instagram
  - Twitter
  - YouTube
  - CodePen
- **Formulário avançado**:
  - Validação em tempo real
  - Labels animadas (floating labels)
  - Feedback visual de erros
  - Sistema de notificações

#### **Rodapé Profissional**
- **Layout em colunas** com informações organizadas
- **Links rápidos** para navegação
- **Redes sociais** com ícones
- **Informações de contato**
- **Direitos autorais** e assinatura

### ⚡ Funcionalidades Técnicas

#### **Navegação e UX**
- Menu mobile responsivo (hamburguer)
- Scroll suave entre seções com offset
- Indicador de progresso de scroll
- Link ativo conforme seção atual
- Header dinâmico ao rolar

#### **Animações e Transições**
- Animações suaves em todos os elementos
- Fade-in ao rolar a página (Intersection Observer)
- Efeitos hover avançados
- Loading animation sequencial
- Transições CSS otimizadas

#### **Formulário Inteligente**
- Validação em tempo real
- Mensagens de erro específicas
- Notificações de sucesso/erro
- Reset animado do formulário
- Floating labels modernas

#### **Performance e Otimização**
- Código otimizado para performance
- Lazy loading de animações
- CSS eficiente com variáveis
- JavaScript modular e organizado

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: 
  - CSS Grid e Flexbox
  - Variáveis CSS customizadas
  - Animações e transições avançadas
  - Design responsivo
- **JavaScript ES6+**:
  - DOM Manipulation
  - Event Listeners avançados
  - Intersection Observer API
  - Form validation
  - Animações programáticas

### **Design e UI/UX**
- **Font Awesome 6**: Ícones profissionais
- **Google Fonts**: Tipografia Inter
- **Cores originais** das tecnologias
- **Gradientes modernos**
- **Sombras e efeitos visuais**

## 📁 Estrutura do Projeto

```
meu-site/
├── index.html      # Estrutura principal com todas as seções
├── styles.css      # Estilos completos com design responsivo
├── script.js       # Funcionalidades JavaScript avançadas
└── README.md       # Documentação completa
```

## 🎨 Personalização

### **Informações Pessoais**

Edite os marcadores no `index.html`:

```html
<!-- Hero Section -->
<h1 class="hero-title">Olá, eu sou [Seu Nome]</h1>
<p class="hero-subtitle">Desenvolvedor Web & Criativo</p>

<!-- About Section -->
Com <span class="highlight">[X] anos de carreira</span>
Como <span class="specialty">[Sua Especialidade]</span>

<!-- Estatísticas -->
<h3 class="stat-number">[X]+</h3>
<p class="stat-label">Anos de Experiência</p>

<!-- Contato -->
<a href="mailto:seu.email@exemplo.com">seu.email@exemplo.com</a>
```

### **Cores e Tema**

Modifique as variáveis CSS em `styles.css`:

```css
:root {
    --primary-color: #667eea;    /* Cor primária */
    --secondary-color: #764ba2;  /* Cor secundária */
    --text-dark: #2d3748;        /* Texto escuro */
    --text-light: #718096;       /* Texto claro */
}
```

### **Projetos**

Adicione seus projetos na seção correspondente:

```html
<div class="project-card" data-category="frontend">
    <div class="project-image">
        <img src="url-da-sua-imagem" alt="Nome do Projeto">
        <div class="project-overlay">
            <div class="project-tech">
                <span class="tech-tag">React</span>
                <span class="tech-tag">Node.js</span>
            </div>
        </div>
    </div>
    <div class="project-content">
        <h3>Nome do Projeto</h3>
        <p>Descrição detalhada do projeto</p>
        <div class="project-links">
            <a href="https://seu-projeto.com" target="_blank" class="project-link preview-btn">
                <i class="fas fa-external-link-alt"></i> Preview
            </a>
            <a href="https://github.com/vinistn-oficial/projeto" target="_blank" class="project-link">
                <i class="fab fa-github"></i> Código
            </a>
        </div>
    </div>
</div>
```

### **Redes Sociais**

Atualize os links no HTML:

```html
<a href="https://github.com/vinistn-oficial" target="_blank" class="social-link github">
    <i class="fab fa-github"></i>
    <span>GitHub</span>
</a>
```

## 🚀 Como Usar

1. **Clone ou baixe os arquivos**
2. **Abra `index.html` no navegador**
3. **Personalize as informações conforme necessário**
4. **Substitua os placeholders por suas informações reais**
5. **Hospede em qualquer servidor web**

## 📱 Compatibilidade

- ✅ **Chrome 60+**
- ✅ **Firefox 55+**
- ✅ **Safari 12+**
- ✅ **Edge 79+**
- ✅ **Mobile Responsivo** (iOS e Android)

## 🔧 Funcionalidades JavaScript Detalhadas

### **Navegação**
- Menu mobile toggle animado
- Smooth scrolling com offset calculado
- Active link detection ao rolar
- Header dinâmico com backdrop blur

### **Animações**
- Intersection Observer para fade-ins
- Skill bars animadas ao entrar na viewport
- Counter animation para estatísticas
- Parallax effect na hero section
- Mouse move interaction (3D effect)

### **Formulário**
- Validação em tempo real
- Floating labels animadas
- Sistema de notificações toast
- Reset animado do formulário
- Feedback visual completo

### **Projetos**
- Sistema de filtro funcional
- Animações de entrada/saída
- Hover effects avançados
- Links externos funcionais

## 🎯 Otimizações Implementadas

### **Performance**
- Código JavaScript otimizado
- CSS eficiente com variáveis
- Animações com GPU acceleration
- Lazy loading de elementos

### **SEO**
- Estrutura semântica HTML5
- Meta tags adequadas
- Navegação por teclado
- Atributos ARIA

### **Acessibilidade**
- Contraste de cores adequado
- Navegação por teclado
- Screen reader friendly
- Focus states visíveis

## 📝 Licença

Este projeto é open source. Sinta-se à vontade para usar, modificar e distribuir conforme necessário.

---

**Desenvolvido com ❤️ usando HTML, CSS e JavaScript puro**

**GitHub**: [vinistn-oficial](https://github.com/vinistn-oficial)
