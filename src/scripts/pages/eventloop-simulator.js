/**
 * DevStudy - Event Loop Interactive Simulator
 */

(function () {
  'use strict';

  const STEPS = [
    {
      codeLine: 1,
      callStack: ['console.log("1: Síncrono")'],
      webApis: [],
      microtasks: [],
      callbacks: [],
      consoleLogs: ['> 1: Síncrono'],
      gearSpin: false,
      explanation: '📌 <strong>Linha 1:</strong> <code>console.log("1: Síncrono")</code> entra direto na <strong>Call Stack</strong>, é executado de imediato e imprime no console.'
    },
    {
      codeLine: 2,
      callStack: ['setTimeout(fn, 0)'],
      webApis: ['Timer 0ms (Web API)'],
      microtasks: [],
      callbacks: [],
      consoleLogs: ['> 1: Síncrono'],
      gearSpin: false,
      explanation: '📌 <strong>Linha 2:</strong> <code>setTimeout</code> entra na Call Stack. Por ser uma API do navegador (Web API), o JavaScript delega o temporizador para a <strong>Web API</strong> e desempilha a chamada!'
    },
    {
      codeLine: 3,
      callStack: [],
      webApis: [],
      microtasks: [],
      callbacks: ['fn() do setTimeout'],
      consoleLogs: ['> 1: Síncrono'],
      gearSpin: true,
      explanation: '⏳ O temporizador de 0ms expirou na Web API! O callback do timeout é enviado para a <strong>Callback Queue (Task Queue)</strong> aguardando a pilha esvaziar.'
    },
    {
      codeLine: 5,
      callStack: ['Promise.resolve().then(...)'],
      webApis: [],
      microtasks: ['fn() da Promise'],
      callbacks: ['fn() do setTimeout'],
      consoleLogs: ['> 1: Síncrono'],
      gearSpin: false,
      explanation: '📌 <strong>Linha 5:</strong> A Promise é resolvida. O callback do <code>.then()</code> vai direto para a <strong>Microtask Queue</strong>, que tem prioridade máxima sobre a Callback Queue!'
    },
    {
      codeLine: 8,
      callStack: ['console.log("4: Síncrono")'],
      webApis: [],
      microtasks: ['fn() da Promise'],
      callbacks: ['fn() do setTimeout'],
      consoleLogs: ['> 1: Síncrono', '> 4: Síncrono'],
      gearSpin: false,
      explanation: '📌 <strong>Linha 8:</strong> <code>console.log("4: Síncrono")</code> é código síncrono. Ele entra na Call Stack e roda ANTES de qualquer fila assíncrona, mesmo o timeout sendo de 0ms!'
    },
    {
      codeLine: 9,
      callStack: ['fn() da Promise'],
      webApis: [],
      microtasks: [],
      callbacks: ['fn() do setTimeout'],
      consoleLogs: ['> 1: Síncrono', '> 4: Síncrono', '> 3: Promise (Microtask)'],
      gearSpin: true,
      explanation: '🔄 <strong>O Event Loop entra em ação!</strong> A Call Stack ficou vazia. O Event Loop checa primeiro as <strong>Microtasks</strong> e descarrega a Promise na pilha!'
    },
    {
      codeLine: 10,
      callStack: ['fn() do setTimeout'],
      webApis: [],
      microtasks: [],
      callbacks: [],
      consoleLogs: ['> 1: Síncrono', '> 4: Síncrono', '> 3: Promise (Microtask)', '> 2: Timeout (Callback)'],
      gearSpin: true,
      explanation: '🔄 Agora que não há mais microtarefas, o Event Loop puxa a <strong>Callback Queue</strong> (o setTimeout) para a pilha e finaliza a execução!'
    },
    {
      codeLine: 0,
      callStack: [],
      webApis: [],
      microtasks: [],
      callbacks: [],
      consoleLogs: ['> 1: Síncrono', '> 4: Síncrono', '> 3: Promise (Microtask)', '> 2: Timeout (Callback)'],
      gearSpin: false,
      explanation: '🎉 <strong>Fim da Execução!</strong> A ordem final foi: <code>1 ➔ 4 ➔ 3 ➔ 2</code>. Agora você domina como o Event Loop, Microtasks e Callbacks funcionam na prática!'
    }
  ];

  let currentStep = -1;
  let isAutoPlaying = false;
  let autoPlayTimer = null;
  let dom = {};

  function initElements() {
    dom.card = document.getElementById('eventLoopSimulator');
    if (!dom.card) return false;

    dom.btnPlay = dom.card.querySelector('#elBtnPlay');
    dom.btnStep = dom.card.querySelector('#elBtnStep');
    dom.btnReset = dom.card.querySelector('#elBtnReset');

    dom.codeLines = dom.card.querySelectorAll('.el-code-line');
    dom.callStack = dom.card.querySelector('#elCallStack');
    dom.webApis = dom.card.querySelector('#elWebApis');
    dom.microtasks = dom.card.querySelector('#elMicrotasks');
    dom.callbacks = dom.card.querySelector('#elCallbacks');
    dom.consoleOut = dom.card.querySelector('#elConsole');
    dom.gear = dom.card.querySelector('#elGear');
    dom.explanation = dom.card.querySelector('#elExplanationText');

    return true;
  }

  function renderStep(index) {
    if (index < 0 || index >= STEPS.length) {
      // Reset state
      dom.codeLines.forEach(l => l.classList.remove('current-executing'));
      dom.callStack.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Pilha vazia</div>';
      dom.webApis.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Nenhuma API ativa</div>';
      dom.microtasks.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Fila vazia</div>';
      dom.callbacks.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Fila vazia</div>';
      dom.consoleOut.innerHTML = '<div style="color: #64748b; font-style:italic;">Aguardando execução...</div>';
      dom.gear.classList.remove('spinning');
      dom.explanation.innerHTML = 'Clique em <strong>"▶️ Executar Passo a Passo"</strong> para ver as funções viajando entre a Pilha, Web APIs e as Filas!';
      return;
    }

    const data = STEPS[index];

    // Highlight code line
    dom.codeLines.forEach(l => {
      const lineNum = parseInt(l.getAttribute('data-line'), 10);
      if (lineNum === data.codeLine) {
        l.classList.add('current-executing');
      } else {
        l.classList.remove('current-executing');
      }
    });

    // Call stack
    if (data.callStack.length === 0) {
      dom.callStack.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Pilha vazia</div>';
    } else {
      dom.callStack.innerHTML = data.callStack.map(item => `
        <div class="el-item callstack-item"><span>📚 ${item}</span></div>
      `).join('');
    }

    // Web APIs
    if (data.webApis.length === 0) {
      dom.webApis.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Nenhuma API ativa</div>';
    } else {
      dom.webApis.innerHTML = data.webApis.map(item => `
        <div class="el-item webapi-item"><span>⏱️ ${item}</span></div>
      `).join('');
    }

    // Microtasks
    if (data.microtasks.length === 0) {
      dom.microtasks.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Fila vazia</div>';
    } else {
      dom.microtasks.innerHTML = data.microtasks.map(item => `
        <div class="el-item microtask-item"><span>⚡ ${item}</span></div>
      `).join('');
    }

    // Callbacks
    if (data.callbacks.length === 0) {
      dom.callbacks.innerHTML = '<div style="font-size:0.75rem; color:#526174; font-style:italic; margin:auto 0; text-align:center;">Fila vazia</div>';
    } else {
      dom.callbacks.innerHTML = data.callbacks.map(item => `
        <div class="el-item callback-item"><span>⏳ ${item}</span></div>
      `).join('');
    }

    // Console
    dom.consoleOut.innerHTML = data.consoleLogs.map(log => `
      <div class="el-console-entry">${log}</div>
    `).join('');

    // Gear
    if (data.gearSpin) {
      dom.gear.classList.add('spinning');
    } else {
      dom.gear.classList.remove('spinning');
    }

    // Explanation
    dom.explanation.innerHTML = data.explanation;
  }

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      renderStep(currentStep);
    } else {
      stopAutoPlay();
    }
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    dom.btnPlay.innerHTML = '<span>▶️</span> Executar Tudo';
  }

  function togglePlay() {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      if (currentStep >= STEPS.length - 1) {
        currentStep = -1;
      }
      isAutoPlaying = true;
      dom.btnPlay.innerHTML = '<span>⏸️</span> Pausar';
      nextStep();
      autoPlayTimer = setInterval(() => {
        if (currentStep < STEPS.length - 1) {
          nextStep();
        } else {
          stopAutoPlay();
        }
      }, 1600);
    }
  }

  function reset() {
    stopAutoPlay();
    currentStep = -1;
    renderStep(-1);
  }

  function init() {
    if (initElements()) {
      dom.btnPlay.addEventListener('click', togglePlay);
      dom.btnStep.addEventListener('click', () => {
        stopAutoPlay();
        nextStep();
      });
      dom.btnReset.addEventListener('click', reset);
      renderStep(-1);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
