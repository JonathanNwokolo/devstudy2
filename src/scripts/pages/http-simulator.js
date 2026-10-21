/**
 * DevStudy - HTTP Request & Response Interactive Simulator
 * Visualizes the lifecycle of HTTP methods (GET, POST, PUT, PATCH, DELETE)
 */

(function () {
  'use strict';

  // Data for each HTTP method
  const SIMULATOR_DATA = {
    GET: {
      method: 'GET',
      safe: true,
      colorClass: 'm-get',
      url: 'https://api.devstudy.com/usuarios/42',
      endpoint: '/api/usuarios/42',
      requestBody: null,
      requestHeaders: {
        'Accept': 'application/json',
        'User-Agent': 'DevStudy-Browser/1.0',
        'Host': 'api.devstudy.com'
      },
      dbAction: 'SELECT * FROM usuarios WHERE id = 42;',
      dbActionText: '🔍 Buscando registro 42 no Banco...',
      statusCode: 200,
      statusText: '200 OK',
      statusClass: 'status-200',
      timeMs: 38,
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'max-age=3600',
        'Server': 'DevStudy-Server/2.4'
      },
      responseBody: {
        id: 42,
        nome: "Ana Lima",
        email: "ana.lima@exemplo.com",
        cargo: "Desenvolvedora Frontend",
        ativo: true
      },
      didactic: {
        title: "O que o GET fez?",
        text: "O cliente solicitou apenas a leitura dos dados do usuário 42. O servidor consultou o banco de dados e devolveu os dados com status 200 OK. Nenhum dado foi criado ou alterado no servidor (operação segura e idempotente)."
      }
    },
    POST: {
      method: 'POST',
      safe: false,
      colorClass: 'm-post',
      url: 'https://api.devstudy.com/usuarios',
      endpoint: '/api/usuarios',
      requestBody: {
        nome: "Carlos Souza",
        email: "carlos@exemplo.com",
        cargo: "Desenvolvedor Backend"
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'api.devstudy.com'
      },
      dbAction: 'INSERT INTO usuarios (nome, email, cargo) VALUES (\'Carlos\', ...);',
      dbActionText: '💾 Inserindo novo registro no Banco...',
      statusCode: 201,
      statusText: '201 Created',
      statusClass: 'status-201',
      timeMs: 64,
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Location': '/api/usuarios/99',
        'Server': 'DevStudy-Server/2.4'
      },
      responseBody: {
        id: 99,
        nome: "Carlos Souza",
        email: "carlos@exemplo.com",
        cargo: "Desenvolvedor Backend",
        criadoEm: "2026-10-05T16:50:00Z"
      },
      didactic: {
        title: "O que o POST fez?",
        text: "O cliente enviou um corpo (payload) com os dados de um novo usuário. O servidor gerou o novo ID 99, salvou na tabela e respondeu com 201 Created junto com o cabeçalho 'Location' indicando onde o novo recurso reside."
      }
    },
    PUT: {
      method: 'PUT',
      safe: false,
      colorClass: 'm-put',
      url: 'https://api.devstudy.com/usuarios/42',
      endpoint: '/api/usuarios/42',
      requestBody: {
        nome: "Ana Lima Ferreira",
        email: "ana.ferreira@exemplo.com",
        cargo: "Tech Lead",
        ativo: true
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'api.devstudy.com'
      },
      dbAction: 'UPDATE usuarios SET nome=\'Ana Lima Ferreira\', ... WHERE id = 42;',
      dbActionText: '🔄 Substituindo registro completo...',
      statusCode: 200,
      statusText: '200 OK',
      statusClass: 'status-200',
      timeMs: 49,
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Server': 'DevStudy-Server/2.4'
      },
      responseBody: {
        id: 42,
        nome: "Ana Lima Ferreira",
        email: "ana.ferreira@exemplo.com",
        cargo: "Tech Lead",
        ativo: true,
        atualizadoEm: "2026-10-05T16:52:10Z"
      },
      didactic: {
        title: "O que o PUT fez?",
        text: "O método PUT realizou uma substituição integral do recurso. O cliente enviou todos os campos do usuário 42 e o servidor sobrescreveu o registro inteiro com as novas informações, devolvendo o recurso atualizado."
      }
    },
    PATCH: {
      method: 'PATCH',
      safe: false,
      colorClass: 'm-patch',
      url: 'https://api.devstudy.com/usuarios/42',
      endpoint: '/api/usuarios/42',
      requestBody: {
        cargo: "Engenheira de Software Principal"
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'api.devstudy.com'
      },
      dbAction: 'UPDATE usuarios SET cargo = \'Engenheira...\' WHERE id = 42;',
      dbActionText: '🔧 Atualizando campo específico...',
      statusCode: 200,
      statusText: '200 OK',
      statusClass: 'status-200',
      timeMs: 41,
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Server': 'DevStudy-Server/2.4'
      },
      responseBody: {
        id: 42,
        nome: "Ana Lima",
        cargo: "Engenheira de Software Principal",
        atualizadoEm: "2026-10-05T16:53:00Z"
      },
      didactic: {
        title: "O que o PATCH fez?",
        text: "Diferente do PUT, o PATCH modificou apenas o campo 'cargo' do usuário 42, sem precisar reenviar o nome, e-mail ou status ativo. É ideal para economizar tráfego e fazer atualizações parciais."
      }
    },
    DELETE: {
      method: 'DELETE',
      safe: false,
      colorClass: 'm-delete',
      url: 'https://api.devstudy.com/usuarios/42',
      endpoint: '/api/usuarios/42',
      requestBody: null,
      requestHeaders: {
        'Accept': '*/*',
        'Host': 'api.devstudy.com'
      },
      dbAction: 'DELETE FROM usuarios WHERE id = 42;',
      dbActionText: '🗑️ Removendo registro do Banco...',
      statusCode: 204,
      statusText: '204 No Content',
      statusClass: 'status-204',
      timeMs: 32,
      responseHeaders: {
        'Server': 'DevStudy-Server/2.4',
        'Date': 'Mon, 05 Oct 2026 16:54:00 GMT'
      },
      responseBody: null,
      didactic: {
        title: "O que o DELETE fez?",
        text: "O cliente enviou uma ordem de exclusão para o registro 42. O servidor apagou a linha correspondente no banco e respondeu com 204 No Content (operação bem-sucedida, sem necessidade de retornar um corpo de dados)."
      }
    }
  };

  // State
  let currentMethod = 'GET';
  let isRunning = false;
  let speedMultiplier = 1; // 1x normal, 0.5x slow
  let animationTimeouts = [];

  // DOM Elements cache
  let dom = {};

  function initElements() {
    dom.simulator = document.getElementById('httpSimulator');
    if (!dom.simulator) return false;

    dom.methodTabs = dom.simulator.querySelectorAll('.sim-method-btn');
    dom.btnRun = dom.simulator.querySelector('#simBtnRun');
    dom.btnSpeed = dom.simulator.querySelector('#simBtnSpeed');

    // Nodes
    dom.clientNode = dom.simulator.querySelector('#simClientNode');
    dom.serverNode = dom.simulator.querySelector('#simServerNode');
    dom.clientUrl = dom.simulator.querySelector('#simClientUrl');
    dom.clientBodyPreview = dom.simulator.querySelector('#simClientBodyPreview');
    dom.clientStatus = dom.simulator.querySelector('#simClientStatus');
    dom.serverStatus = dom.simulator.querySelector('#simServerStatus');
    dom.dbCylinder = dom.simulator.querySelector('#simDbCylinder');
    dom.serverLeds = dom.simulator.querySelectorAll('.sim-led');

    // Packets & lanes
    dom.reqPacket = dom.simulator.querySelector('#simReqPacket');
    dom.resPacket = dom.simulator.querySelector('#simResPacket');
    dom.reqTrackLane = dom.simulator.querySelector('#simReqLane');
    dom.resTrackLane = dom.simulator.querySelector('#simResLane');

    // Stepper
    dom.steps = dom.simulator.querySelectorAll('.sim-step-item');

    // Inspector
    dom.reqInspector = dom.simulator.querySelector('#simReqInspector');
    dom.resInspector = dom.simulator.querySelector('#simResInspector');
    dom.didacticBox = dom.simulator.querySelector('#simDidacticBox');

    return true;
  }

  function clearAllTimeouts() {
    animationTimeouts.forEach(t => clearTimeout(t));
    animationTimeouts = [];
  }

  function updateStaticUI(methodKey) {
    const data = SIMULATOR_DATA[methodKey];
    if (!data) return;

    // Update active tab
    dom.methodTabs.forEach(tab => {
      const tabMethod = tab.getAttribute('data-method');
      if (tabMethod === methodKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Client Screen
    dom.clientUrl.textContent = `${data.method} ${data.endpoint}`;
    if (data.requestBody) {
      const summary = JSON.stringify(data.requestBody);
      dom.clientBodyPreview.textContent = summary.length > 32 ? summary.slice(0, 30) + '...' : summary;
      dom.clientBodyPreview.style.display = 'block';
    } else {
      dom.clientBodyPreview.textContent = '(Sem body)';
      dom.clientBodyPreview.style.display = 'block';
    }

    // Reset packets
    dom.reqPacket.className = `sim-packet req-packet`;
    dom.reqPacket.innerHTML = `📦 ${data.method}`;
    dom.reqPacket.style.left = '0%';
    dom.reqPacket.classList.remove('visible');

    dom.resPacket.className = `sim-packet res-packet ${data.statusClass}`;
    dom.resPacket.innerHTML = `↩️ ${data.statusText}`;
    dom.resPacket.style.left = '100%';
    dom.resPacket.classList.remove('visible');

    // Reset Nodes Status
    dom.clientNode.classList.remove('active-sender', 'active-receiver');
    dom.serverNode.classList.remove('active-sender', 'active-receiver');
    dom.dbCylinder.classList.remove('pulsing');
    dom.serverLeds.forEach(led => led.classList.remove('on'));

    dom.clientStatus.textContent = 'Pronto para enviar';
    dom.serverStatus.textContent = 'Aguardando requisição...';

    // Reset Stepper
    dom.steps.forEach(step => step.classList.remove('active', 'completed'));
    if (dom.steps[0]) dom.steps[0].classList.add('active');

    // Render Inspector
    renderInspector(data, false);
  }

  function renderInspector(data, showResponse) {
    // Request pane
    let reqHtml = `
      <div class="sim-code-line">
        <span class="token-method ${data.method.toLowerCase()}">${data.method}</span>
        <span>${data.endpoint} HTTP/1.1</span>
      </div>
    `;
    for (const [key, val] of Object.entries(data.requestHeaders)) {
      reqHtml += `<div class="sim-code-line dim">${key}: ${val}</div>`;
    }
    if (data.requestBody) {
      reqHtml += `<div class="sim-json-block">${JSON.stringify(data.requestBody, null, 2)}</div>`;
    }
    dom.reqInspector.innerHTML = reqHtml;

    // Response pane
    if (showResponse) {
      let resHtml = `
        <div class="sim-code-line">
          <span>HTTP/1.1</span>
          <span class="token-status ${data.statusClass}">${data.statusText}</span>
          <span class="dim">(${data.timeMs}ms)</span>
        </div>
      `;
      for (const [key, val] of Object.entries(data.responseHeaders)) {
        resHtml += `<div class="sim-code-line dim">${key}: ${val}</div>`;
      }
      if (data.responseBody) {
        resHtml += `<div class="sim-json-block">${JSON.stringify(data.responseBody, null, 2)}</div>`;
      } else {
        resHtml += `<div class="sim-code-line dim" style="margin-top: 10px; font-style: italic;">&lt;Corpo vazio / No Content&gt;</div>`;
      }
      dom.resInspector.innerHTML = resHtml;
    } else {
      dom.resInspector.innerHTML = `
        <div class="sim-code-line dim" style="padding: 20px 0; text-align: center;">
          ⏳ Dispare a requisição para visualizar a resposta...
        </div>
      `;
    }

    // Didactic box
    dom.didacticBox.innerHTML = `
      <div class="sim-didactic-icon">💡</div>
      <div class="sim-didactic-content">
        <h4>${data.didactic.title}</h4>
        <p>${data.didactic.text}</p>
      </div>
    `;
  }

  function setStep(stepIndex) {
    dom.steps.forEach((step, idx) => {
      step.classList.remove('active');
      if (idx < stepIndex) {
        step.classList.add('completed');
      } else if (idx === stepIndex) {
        step.classList.add('active');
      } else {
        step.classList.remove('completed');
      }
    });
  }

  function animatePacket(packetEl, fromPercent, toPercent, durationMs, onComplete) {
    const isMobile = window.innerWidth <= 768;
    const startTime = performance.now();
    packetEl.classList.add('visible');

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Easing function (ease-in-out)
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      const currentVal = fromPercent + (toPercent - fromPercent) * ease;

      if (isMobile) {
        packetEl.style.left = '50%';
        packetEl.style.top = `${currentVal}%`;
      } else {
        packetEl.style.top = '50%';
        packetEl.style.left = `${currentVal}%`;
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(frame);
  }

  function runSimulation() {
    if (isRunning) return;
    isRunning = true;
    clearAllTimeouts();

    dom.btnRun.disabled = true;
    dom.btnRun.innerHTML = '<span>⚡</span> Executando...';

    const data = SIMULATOR_DATA[currentMethod];
    updateStaticUI(currentMethod);

    // Timing calculation based on speedMultiplier
    const tPrep = 400 * speedMultiplier;
    const tTravelReq = 1100 * speedMultiplier;
    const tServerProc = 1100 * speedMultiplier;
    const tTravelRes = 1100 * speedMultiplier;

    // STEP 1: Client prepares
    setStep(0);
    dom.clientNode.classList.add('active-sender');
    dom.clientStatus.textContent = '📤 Disparando ' + data.method + '...';

    // STEP 2: Packet leaves client
    const t1 = setTimeout(() => {
      setStep(1);
      animatePacket(dom.reqPacket, 0, 100, tTravelReq, () => {
        dom.reqPacket.classList.remove('visible');
        dom.clientNode.classList.remove('active-sender');

        // STEP 3: Server processes
        setStep(2);
        dom.serverNode.classList.add('active-receiver');
        dom.serverLeds.forEach(led => led.classList.add('on'));
        dom.dbCylinder.classList.add('pulsing');
        dom.serverStatus.textContent = data.dbActionText;

        const t2 = setTimeout(() => {
          dom.serverStatus.textContent = '✓ Pronto! Devolvendo ' + data.statusText;
          dom.dbCylinder.classList.remove('pulsing');

          // STEP 4: Response leaves server
          setStep(3);
          dom.serverNode.classList.remove('active-receiver');
          
          animatePacket(dom.resPacket, 100, 0, tTravelRes, () => {
            dom.resPacket.classList.remove('visible');
            dom.serverLeds.forEach(led => led.classList.remove('on'));

            // STEP 5: Arrived at client
            setStep(4);
            dom.clientNode.classList.add('active-receiver');
            dom.clientStatus.textContent = `✅ Recebido: ${data.statusText} (${data.timeMs}ms)`;
            
            // Show response in Inspector
            renderInspector(data, true);

            const t3 = setTimeout(() => {
              dom.clientNode.classList.remove('active-receiver');
              isRunning = false;
              dom.btnRun.disabled = false;
              dom.btnRun.innerHTML = '<span>▶️</span> Disparar Requisição';
            }, 800);
            animationTimeouts.push(t3);
          });
        }, tServerProc);
        animationTimeouts.push(t2);
      });
    }, tPrep);
    animationTimeouts.push(t1);
  }

  function setMethod(methodKey, autoRun = true) {
    if (!SIMULATOR_DATA[methodKey]) return;
    currentMethod = methodKey;
    clearAllTimeouts();
    isRunning = false;
    dom.btnRun.disabled = false;
    dom.btnRun.innerHTML = '<span>▶️</span> Disparar Requisição';
    updateStaticUI(methodKey);

    if (autoRun) {
      runSimulation();
    }
  }

  // Global helper to link cards in the page to the simulator
  window.selectSimulatorMethod = function (methodKey) {
    if (!dom.simulator) {
      initElements();
    }
    if (dom.simulator) {
      dom.simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setMethod(methodKey, true);
      }, 350);
    }
  };

  // Setup Event Listeners
  function attachEvents() {
    dom.methodTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const method = tab.getAttribute('data-method');
        setMethod(method, true);
      });
    });

    dom.btnRun.addEventListener('click', () => {
      runSimulation();
    });

    if (dom.btnSpeed) {
      dom.btnSpeed.addEventListener('click', () => {
        if (speedMultiplier === 1) {
          speedMultiplier = 1.8;
          dom.btnSpeed.innerHTML = '<span>🐢</span> 0.5x (Lento)';
        } else {
          speedMultiplier = 1;
          dom.btnSpeed.innerHTML = '<span>⚡</span> 1x (Normal)';
        }
      });
    }
  }

  // Initialize on DOMContentLoaded or immediate
  function init() {
    if (initElements()) {
      attachEvents();
      updateStaticUI('GET');
      // Run once on load smoothly after short delay
      setTimeout(() => {
        runSimulation();
      }, 700);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
