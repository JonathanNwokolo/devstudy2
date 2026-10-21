/**
 * DevStudy - Express Middleware Pipeline Interactive Simulator
 */

(function () {
  'use strict';

  let hasValidToken = true;
  let isRunning = false;
  let dom = {};

  function initElements() {
    dom.card = document.getElementById('middlewareSimulator');
    if (!dom.card) return false;

    dom.btnValid = dom.card.querySelector('#mwBtnValidToken');
    dom.btnInvalid = dom.card.querySelector('#mwBtnInvalidToken');
    dom.btnRun = dom.card.querySelector('#mwBtnRun');

    dom.gateClient = dom.card.querySelector('#mwGateClient');
    dom.gateLogger = dom.card.querySelector('#mwGateLogger');
    dom.gateAuth = dom.card.querySelector('#mwGateAuth');
    dom.gateRate = dom.card.querySelector('#mwGateRate');
    dom.gateRoute = dom.card.querySelector('#mwGateRoute');

    dom.termLog = dom.card.querySelector('#mwTermLog');
    dom.explanation = dom.card.querySelector('#mwExplanation');

    return true;
  }

  function resetGates() {
    const gates = [dom.gateClient, dom.gateLogger, dom.gateAuth, dom.gateRate, dom.gateRoute];
    gates.forEach(g => {
      if (g) {
        g.className = 'mw-gate';
        const st = g.querySelector('.mw-gate-status');
        if (st) st.textContent = 'Aguardando';
      }
    });
  }

  function runPipeline() {
    if (isRunning) return;
    isRunning = true;
    dom.btnRun.disabled = true;
    resetGates();

    // Step 1: Client sends request
    dom.gateClient.classList.add('gate-passed');
    dom.gateClient.querySelector('.mw-gate-status').textContent = 'Disparado!';
    dom.termLog.textContent = '> GET /api/v1/painel-vip HTTP/1.1';
    dom.explanation.textContent = '1. O cliente fez uma requisição HTTP. Ela entra na esteira de middlewares do Express.';

    // Step 2: Logger Middleware
    setTimeout(() => {
      dom.gateLogger.classList.add('gate-passed');
      dom.gateLogger.querySelector('.mw-gate-status').textContent = 'next()';
      dom.termLog.textContent = '[Logger] GET /api/v1/painel-vip - 2026-10-05 14:00:00';
      dom.explanation.textContent = '2. [Logger] registrou o acesso no console e chamou next() para passar a bola para o próximo middleware.';

      // Step 3: Auth Middleware
      setTimeout(() => {
        if (hasValidToken) {
          dom.gateAuth.classList.add('gate-passed');
          dom.gateAuth.querySelector('.mw-gate-status').textContent = 'Token OK (next)';
          dom.termLog.textContent = '[Auth] Token JWT verificado com sucesso para usuario_id: 42.';
          dom.explanation.textContent = '3. [Auth] encontrou o cabeçalho Authorization com token válido! Chamou next().';

          // Step 4: Rate Limiter
          setTimeout(() => {
            dom.gateRate.classList.add('gate-passed');
            dom.gateRate.querySelector('.mw-gate-status').textContent = 'Quota OK (next)';
            dom.termLog.textContent = '[RateLimit] 1/60 requisições consumidas no minuto.';
            dom.explanation.textContent = '4. [RateLimit] verificou que o IP não estourou o limite de requisições. Chamou next().';

            // Step 5: Route Controller
            setTimeout(() => {
              dom.gateRoute.classList.add('gate-passed');
              dom.gateRoute.querySelector('.mw-gate-status').textContent = '200 OK';
              dom.termLog.textContent = '<< HTTP/1.1 200 OK: { "sucesso": true, "msg": "Bem-vindo ao Painel VIP!" }';
              dom.explanation.innerHTML = '🎉 <strong>Sucesso!</strong> A requisição passou por todos os middlewares e a rota final respondeu 200 OK com os dados solicitados!';
              isRunning = false;
              dom.btnRun.disabled = false;
            }, 600);
          }, 600);
        } else {
          // Token is invalid/missing
          dom.gateAuth.classList.add('gate-blocked');
          dom.gateAuth.querySelector('.mw-gate-status').textContent = '401 Bloqueado!';
          dom.termLog.textContent = '<< HTTP/1.1 401 Unauthorized: { "erro": "Token não fornecido ou inválido" }';
          dom.explanation.innerHTML = '🚫 <strong>Bloqueado no Middleware de Auth!</strong> Como o token não foi enviado, este middleware <strong>NÃO</strong> chamou <code>next()</code> e interrompeu o fluxo de imediato com 401 Unauthorized, protegendo os middlewares seguintes e a rota!';
          isRunning = false;
          dom.btnRun.disabled = false;
        }
      }, 600);
    }, 600);
  }

  function init() {
    if (initElements()) {
      dom.btnValid.addEventListener('click', () => {
        hasValidToken = true;
        dom.btnValid.classList.add('active');
        dom.btnInvalid.classList.remove('active-denied');
        resetGates();
        dom.termLog.textContent = 'Configurado: Requisição enviará cabeçalho [Authorization: Bearer xyz...]';
        dom.explanation.textContent = 'Clique em "Simular Passagem" para ver a requisição passar por todos os middlewares.';
      });

      dom.btnInvalid.addEventListener('click', () => {
        hasValidToken = false;
        dom.btnInvalid.classList.add('active-denied');
        dom.btnValid.classList.remove('active');
        resetGates();
        dom.termLog.textContent = 'Configurado: Requisição SEM cabeçalho de autenticação.';
        dom.explanation.textContent = 'Clique em "Simular Passagem" para ver o middleware de Auth interceptar e barrar a requisição.';
      });

      dom.btnRun.addEventListener('click', runPipeline);
      resetGates();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
