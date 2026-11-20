'use strict';
const app = document.querySelector('#app');
const KEY = 'codetrail-progresso-v1';
let trilhas = [];
let usuario = null;
let progressoRemoto = null;
let csrf = '';
async function api(path, options={})  {
  const headers= {
    ...(options.headers||{})
  };
  if(options.method && options.method!=='GET')headers['X-XSRF-TOKEN']=csrf;
  const response=await fetch(path,{credentials:'same-origin',...options,headers});
  if(!response.ok) {
    let msg='Erro '+response.status;
    try {
      const j=await response.json();
      msg=j.error||j.message||msg
    }
    catch {
    }
    throw new Error(msg)
  }
  return response.status===204?null:response.json();
}
async function csrfToken() {
  const data=await api('/api/auth/csrf');
  csrf=data.token;
}
async function atualizarSessao() {
  try  {
    usuario=await api('/api/auth/me');
    const ids=await api('/api/progress');
    progressoRemoto=Object.fromEntries(ids.map(id=>[id,true]));
  }
  catch {
    usuario=null;
    progressoRemoto=null;
  }
}
function topo() {
  const nav=document.querySelector('.topbar nav');
  nav.innerHTML='<a href="#trilhas">Trilhas</a><a href="#progresso">Meu progresso</a>'+(usuario?'<a href="#conta">Minha conta</a>':'<a href="#entrar">Entrar</a>');
}
function formConta(modo='entrar') {
  const cadastro=modo==='cadastro';
  app.innerHTML=`<div class="auth card"><a class="back" href="#">← Início</a><div class="eyebrow">Sua conta CodeTrail</div><h1>${cadastro?'Criar conta':'Bem-vindo de volta'}</h1>
 <p>${cadastro?'Crie uma conta gratuita para sincronizar seu progresso.':'Entre para continuar aprendendo de onde parou.'}</p>
 <form id="form-conta">${cadastro?'<label>Nome<input name="name" minlength="2" maxlength="90" required autocomplete="name"></label>':''}
 <label>E-mail<input type="email" name="email" required autocomplete="email"></label>
 <label>Senha<input type="password" name="password" minlength="8" required autocomplete="${cadastro?'new-password':'current-password'}"></label>
 <button class="btn" type="submit">${cadastro?'Criar conta':'Entrar'}</button></form>
 <p id="mensagem" role="status"></p><p>${cadastro?'Já possui conta? <a href="#entrar">Entrar</a>':'Não tem conta? <a href="#cadastro">Cadastre-se</a>'}</p></div>`;
  document.querySelector('#form-conta').addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(e.target),email=String(f.get('email')),password=String(f.get('password'));
  const msg=document.querySelector('#mensagem');msg.textContent='Aguarde...';
  try{
  await csrfToken();
  if(cadastro){await api('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:String(f.get('name')),email,password})});await csrfToken();}
  const data=new URLSearchParams({username:email,password});
  await api('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data});
  await csrfToken();await atualizarSessao();topo();location.hash='#conta';navegar();
  }catch(err){msg.textContent=err.message;}
  });
}
function conta() {
  if(!usuario) {
    location.hash='#entrar';
    return;
  }
  const feitas=Object.keys(progressoRemoto||{}).length;
  app.innerHTML=`<a class="back" href="#">← Início</a><div class="eyebrow">Área do estudante</div><h1 class="page-title">Olá, ${escapeHtml(usuario.name)}!</h1>
 <p class="lead">Seu progresso está sincronizado com sua conta neste servidor.</p><div class="stats"><div class="stat"><strong>${feitas}</strong><small>Aulas concluídas</small></div><div class="stat"><strong>${trilhas.length}</strong><small>Trilhas</small></div><div class="stat"><strong>${trilhas.flatMap(aulas).length}</strong><small>Aulas disponíveis</small></div></div>
 <button class="btn secondary" id="sair">Sair da conta</button>`;
  document.querySelector('#sair').onclick=async()=> {
    try {
      await csrfToken();
      await api('/api/auth/logout',{method:'POST'});
      await csrfToken();
      await atualizarSessao();
      topo();
      location.hash='#';
      navegar();
    }
    catch(err) {
      alert(err.message)
    }
  };
}
function progresso()  {
  if (progressoRemoto !== null) return progressoRemoto;
  try  {
    return JSON.parse(localStorage.getItem(KEY)) ||  {
    };
  }
  catch  {
    return  {
    };
  }
}
function salvar(id)  {
  const dados = progresso();
  dados[id] = true;
  localStorage.setItem(KEY, JSON.stringify(dados));
}
function escapeHtml(s)  {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function aulas(t) { return t.modulos.flatMap(m => m.aulas); }
function percentual(t) {
  const items = aulas(t), p = progresso();
  return items.length ? Math.round(items.filter(a => p[a.id]).length / items.length * 100) : 0;
}
function barra(n) { return `<div class="bar" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100"><span style="width:${n}%"></span></div>`; }
function inicio() {
  const total = trilhas.reduce((n,t)=>n+aulas(t).length,0);
  const feitos = trilhas.flatMap(aulas).filter(a=>progresso()[a.id]).length;
  app.innerHTML = `
    <section class="hero"><div class="eyebrow">Escola aberta de programação</div>
      <h1>Aprenda programação<br><em>desde o primeiro passo.</em></h1>
      <p>Uma escola gratuita de lógica, C e C++. Estude a teoria, entenda exemplos, pratique com orientação e construa seus próprios programas.</p>
      <a class="btn" href="#trilhas">Explorar trilhas →</a></section>
    <section id="progresso"><div class="section-head"><div><h2>Sua evolução</h2><p>${usuario?'Sincronizado com sua conta.':'Crie uma conta gratuita para acompanhar sua evolução.'}</p></div></div>
      <div class="stats"><div class="stat"><strong>${trilhas.length}</strong><small>Trilhas disponíveis</small></div>
      <div class="stat"><strong>${total}</strong><small>Aulas disponíveis</small></div>
      <div class="stat"><strong>${feitos}</strong><small>Aulas concluídas</small></div></div></section>
    <section id="trilhas"><div class="section-head"><div><h2>Escolha sua trilha</h2><p>Do primeiro programa aos conceitos essenciais.</p></div></div>
    <div class="grid">${trilhas.map(t=>`<article class="card">
      <div class="iconbox ${t.slug==='cpp'?'cpp':''}">${t.slug==='cpp'?'C++':t.slug==='c'?'C':'01'}</div>
      <h3>${escapeHtml(t.titulo)}</h3><p>${escapeHtml(t.descricao)}</p>
      <div class="meta"><span>${aulas(t).length} aulas</span><span>${percentual(t)}% concluído</span></div>
      ${barra(percentual(t))}<a class="btn" href="#trilha/${t.slug}">Ver trilha →</a></article>`).join('')}</div></section>`;
}
function trilha(slug) {
  const t = trilhas.find(x=>x.slug===slug);
  if (!t) return erro();
  app.innerHTML = `<a class="back" href="#">← Voltar ao início</a><div class="eyebrow">Trilha de aprendizado</div>
    <h1 class="page-title">${escapeHtml(t.titulo)}</h1><p class="lead">${escapeHtml(t.descricao)}</p>
    <div class="meta"><span>${aulas(t).length} aulas</span><span>${percentual(t)}% concluído</span></div>${barra(percentual(t))}
    ${t.modulos.map(m=>`<section><div class="section-head"><div><h2>${escapeHtml(m.titulo)}</h2><p>Aprenda no seu ritmo.</p></div></div>
    <div class="lesson-list">${m.aulas.map((a,i)=>`<a class="lesson-row" href="#aula/${slug}/${a.id}">
    <span class="number">${String(i+1).padStart(2,'0')}</span><span><strong>${escapeHtml(a.titulo)}</strong><small>${escapeHtml(a.subtitulo)}</small></span>
    <span class="check">${progresso()[a.id]?'✓ Concluída':'→'}</span></a>`).join('')}</div></section>`).join('')}`;
}
function aula(slug, id) {
  const trilhaAtual = trilhas.find(trilha => trilha.slug === slug);
  const item = trilhaAtual && aulas(trilhaAtual).find(a => a.id === id);

  if (!item) {
    erro();
    return;
  }

  const lista = aulas(trilhaAtual);
  const indice = lista.findIndex(a => a.id === id);
  const proxima = lista[indice + 1];
  const pratica = item.pratica;
  let questaoAtual = 0;
  let acertos = 0;

  app.innerHTML = `
    <div class="article">
      <a class="back" href="#trilha/${slug}">← Voltar à trilha</a>
      <div class="eyebrow">${escapeHtml(trilhaAtual.titulo)} · Aula ${indice + 1} de ${lista.length}</div>
      <h1 class="page-title">${escapeHtml(item.titulo)}</h1>
      <p class="lead">${escapeHtml(item.subtitulo)}</p>

      <section class="school-panel">
        <div class="eyebrow">O que você vai aprender</div>
        <ul>${(item.objetivos || []).map(objetivo => `<li>${escapeHtml(objetivo)}</li>`).join('')}</ul>
      </section>

      <h2>Entenda o conceito</h2>
      ${(item.explicacaoDetalhada || [item.teoria]).map(paragrafo => `<p>${escapeHtml(paragrafo)}</p>`).join('')}

      <section class="school-panel chapter-section">
        <div class="eyebrow">Capítulo aprofundado</div>
        <h2>Por que este conceito importa?</h2>
        <p>${escapeHtml(item.capitulo?.conceito || item.teoria)}</p>
        <h2>Como o programa se comporta?</h2>
        <p>${escapeHtml(item.capitulo?.execucao || '')}</p>
      </section>

      <section class="school-panel">
        <h2>Estude passo a passo</h2>
        <ol>${(item.passoAPasso || []).map(passo => `<li>${escapeHtml(passo)}</li>`).join('')}</ol>
      </section>

      <h2>Exemplo comentado para estudar</h2>
      <div class="code-head">
        <span>${slug === 'cpp' ? 'exemplo.cpp' : 'exemplo.c'}</span>
        <button id="copiar" type="button">Copiar código</button>
      </div>
      <pre class="code"><code>${escapeHtml(item.codigo)}</code></pre>

      <section class="school-panel line-study">
        <div class="eyebrow">Leitura guiada</div>
        <h2>Explicação linha por linha</h2>
        <p>Compare cada linha do programa com sua finalidade. As observações sobre sintaxe são um guia inicial; investigue também os valores concretos usados em cada exemplo.</p>
        <div class="line-list">
          ${(item.linhasComentadas || []).map(linha => `
            <div class="line-entry">
              <div class="line-source"><span class="line-number">${linha.numero}</span><code>${escapeHtml(linha.codigo || '↵')}</code></div>
              <p>${escapeHtml(linha.explicacao)}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="school-panel chapter-section">
        <div class="eyebrow">Laboratório de aprendizagem</div>
        <h2>Experimento orientado</h2>
        <p>${escapeHtml(item.capitulo?.laboratorio || '')}</p>
        <h3>Atividades complementares</h3>
        <ol>${(item.atividadesExtras || []).map(atividade => `<li><strong>${escapeHtml(atividade.tipo)}:</strong> ${escapeHtml(atividade.enunciado)}</li>`).join('')}</ol>
        <h3>Questões para refletir</h3>
        <ul>${(item.capitulo?.perguntasReflexao || []).map(pergunta => `<li>${escapeHtml(pergunta)}</li>`).join('')}</ul>
      </section>

      <section class="school-panel">
        <h2>Erros comuns e como evitá-los</h2>
        <ul>${(item.errosComuns || []).map(erro => `<li>${escapeHtml(erro)}</li>`).join('')}</ul>
        <h2>Vocabulário da aula</h2>
        <dl>${(item.glossario || []).map(termo => `<dt><strong>${escapeHtml(termo.termo)}</strong></dt><dd>${escapeHtml(termo.definicao)}</dd>`).join('')}</dl>
      </section>

      <section class="quiz">
        <div class="eyebrow">Exercícios de fixação</div>
        <div id="questao-container"></div>
        <p class="feedback" id="feedback" role="status"></p>
      </section>

      <section class="quiz practical">
        <div class="eyebrow">Desafio prático</div>
        <h2>Agora é sua vez de programar</h2>
        <p>${escapeHtml(pratica?.enunciado || 'Crie uma variação do exemplo da aula.')}</p>
        <h3>Critérios de conclusão</h3>
        <ul>${(pratica?.requisitos || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
        <details><summary>Precisa de uma dica?</summary><p>${escapeHtml(pratica?.dica || 'Comece com um programa pequeno.')}</p></details>
        <div class="school-panel">
          <h3>Checklist de teste prático</h3>
          <label><input type="checkbox"> Escrevi minha própria solução.</label><br>
          <label><input type="checkbox"> Compilei e executei no meu computador.</label><br>
          <label><input type="checkbox"> Testei pelo menos dois casos.</label><br>
          <label><input type="checkbox"> Consigo explicar o funcionamento.</label>
        </div>
        <p class="muted">O editor abaixo é um rascunho. Não compila, não executa e não corrige automaticamente o código. As marcações são para autoavaliação.</p>
        <label for="rascunho">Anotações ou rascunho de código (salvo neste navegador)</label>
        <textarea id="rascunho" rows="9" spellcheck="false" placeholder="Escreva seu código ou suas anotações aqui..."></textarea>
        <div class="practice-actions">
          <button class="btn secondary" id="salvar-rascunho" type="button">Salvar rascunho</button>
          <span id="status-rascunho" role="status"></span>
        </div>
      </section>
      <div id="proxima"></div>
    </div>`;

  const rascunho = document.querySelector('#rascunho');
  const chave = `codetrail-rascunho-${item.id}`;
  rascunho.value = localStorage.getItem(chave) || '';

  rascunho.addEventListener('input', () => {
    localStorage.setItem(chave, rascunho.value);
    document.querySelector('#status-rascunho').textContent = 'Rascunho salvo automaticamente.';
  });

  document.querySelector('#salvar-rascunho').addEventListener('click', () => {
    localStorage.setItem(chave, rascunho.value);
    document.querySelector('#status-rascunho').textContent = 'Rascunho salvo neste navegador.';
  });

  document.querySelector('#copiar').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(item.codigo);
      document.querySelector('#copiar').textContent = 'Copiado!';
    } catch {
      document.querySelector('#copiar').textContent = 'Selecione e copie o código';
    }
  });

  function mostrarQuestao() {
    const q = item.exercicios[questaoAtual];
    const container = document.querySelector('#questao-container');
    container.innerHTML = `
      <p class="muted">Questão ${questaoAtual + 1} de ${item.exercicios.length}</p>
      <h3>${escapeHtml(q.pergunta)}</h3>
      <div id="opcoes">
        ${q.opcoes.map((opcao, i) => `
          <button class="option" data-opcao="${i}" type="button">
            ${escapeHtml(opcao)}
          </button>
        `).join('')}
      </div>`;

    container.querySelectorAll('[data-opcao]').forEach(botao => {
      botao.addEventListener('click', () => responder(Number(botao.dataset.opcao), botao));
    });
  }

  async function responder(opcao, botao) {
    const feedback = document.querySelector('#feedback');
    if (!usuario) {
      feedback.innerHTML = 'Para responder e salvar o progresso, <a href="#entrar">entre na sua conta gratuita</a>.';
      return;
    }

    document.querySelectorAll('[data-opcao]').forEach(b => b.disabled = true);
    try {
      await csrfToken();
      const resultado = await api('/api/progress/answer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lessonId: item.id, questionIndex: questaoAtual, option: opcao})
      });

      if (!resultado.correct) {
        botao.classList.add('wrong');
        feedback.textContent = 'Ainda não! Revise o conteúdo e tente novamente.';
        document.querySelectorAll('[data-opcao]').forEach(b => b.disabled = false);
        return;
      }

      botao.classList.add('correct');
      acertos++;
      questaoAtual++;
      feedback.textContent = 'Resposta correta!';

      if (questaoAtual < item.exercicios.length) {
        mostrarQuestao();
      } else {
        progressoRemoto[item.id] = true;
        feedback.textContent = `${acertos} questões respondidas corretamente! Aula concluída.`;
        document.querySelector('#questao-container').innerHTML = '<h3>Parabéns! Você concluiu a fixação.</h3>';
        document.querySelector('#proxima').innerHTML = proxima
          ? `<a class="btn" href="#aula/${slug}/${proxima.id}">Próxima aula →</a>`
          : `<a class="btn" href="#trilha/${slug}">Voltar à trilha ✓</a>`;
      }
    } catch (err) {
      feedback.textContent = 'Não foi possível verificar a resposta: ' + err.message;
      document.querySelectorAll('[data-opcao]').forEach(b => b.disabled = false);
    }
  }

  mostrarQuestao();
}
function erro(){app.innerHTML='<div class="empty">Página não encontrada. <a class="back" href="#">Voltar ao início</a></div>';}
function navegar(){
  const partes=decodeURIComponent(location.hash.slice(1)).split('/');
  if(partes[0]==='entrar'||partes[0]==='cadastro')formConta(partes[0]);
  else if(partes[0]==='conta')conta();
  else if(partes[0]==='trilha')trilha(partes[1]);
  else if(partes[0]==='aula')aula(partes[1],partes[2]);
  else inicio();
  if(partes[0]==='trilha'||partes[0]==='aula')window.scrollTo(0,0);
}
async function iniciar(){
  try {
    const r=await fetch('/api/trilhas');
    if(!r.ok)throw new Error('HTTP '+r.status);
    trilhas=await r.json();
    await csrfToken();await atualizarSessao();topo();navegar();
    window.addEventListener('hashchange',navegar);
  } catch(e) {
    app.innerHTML='<div class="empty">Não foi possível carregar as trilhas. Inicie o servidor Spring Boot e atualize a página.</div>';
    console.error(e);
  }
}
iniciar();
