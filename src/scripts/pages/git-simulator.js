/**
 * DevStudy - Git 4-Areas & Workflow Interactive Simulator
 */

(function () {
  'use strict';

  // Initial State
  const INITIAL_FILES = [
    { name: 'index.html', status: 'modified', icon: '📄' },
    { name: 'style.css', status: 'modified', icon: '🎨' },
    { name: 'app.js', status: 'untracked', icon: '⚡' }
  ];

  let state = {
    working: [...INITIAL_FILES],
    staging: [],
    localCommits: [
      { hash: 'e4f1a2', msg: 'initial commit', branch: 'main' }
    ],
    remoteCommits: [
      { hash: 'e4f1a2', msg: 'initial commit', branch: 'main' }
    ],
    currentBranch: 'main',
    hasFeatureBranch: false
  };

  let dom = {};

  function initElements() {
    dom.card = document.getElementById('gitSimulator');
    if (!dom.card) return false;

    dom.btnAdd = dom.card.querySelector('#gitBtnAdd');
    dom.btnCommit = dom.card.querySelector('#gitBtnCommit');
    dom.btnPush = dom.card.querySelector('#gitBtnPush');
    dom.btnBranch = dom.card.querySelector('#gitBtnBranch');
    dom.btnReset = dom.card.querySelector('#gitBtnReset');

    dom.workingBox = dom.card.querySelector('#gitWorkingFiles');
    dom.stagingBox = dom.card.querySelector('#gitStagingFiles');
    dom.localBox = dom.card.querySelector('#gitLocalCommits');
    dom.remoteBox = dom.card.querySelector('#gitRemoteCommits');

    dom.terminal = dom.card.querySelector('#gitTerminalOutput');
    dom.explanation = dom.card.querySelector('#gitExplanation');

    return true;
  }

  function render() {
    // Working Directory
    if (state.working.length === 0) {
      dom.workingBox.innerHTML = '<div class="git-empty-hint">Nenhum arquivo modificado. Árvore limpa! ✨</div>';
    } else {
      dom.workingBox.innerHTML = state.working.map(f => `
        <div class="git-file-chip">
          <span>${f.icon} ${f.name}</span>
          <span style="font-size: 0.65rem; color: ${f.status === 'modified' ? '#f59e0b' : '#10b981'}; font-weight:700;">
            ${f.status === 'modified' ? 'M' : 'U'}
          </span>
        </div>
      `).join('');
    }

    // Staging Area
    if (state.staging.length === 0) {
      dom.stagingBox.innerHTML = '<div class="git-empty-hint">Palco vazio. Use <code>git add</code> para preparar arquivos.</div>';
    } else {
      dom.stagingBox.innerHTML = state.staging.map(f => `
        <div class="git-file-chip staged">
          <span>${f.icon} ${f.name}</span>
          <span style="font-size: 0.65rem; color: #10b981; font-weight: 700;">STAGED</span>
        </div>
      `).join('');
    }

    // Local Repository
    dom.localBox.innerHTML = state.localCommits.map(c => `
      <div class="git-commit-node ${c.branch === 'feature' ? 'feature-branch' : ''}">
        <span class="git-commit-hash">${c.hash}</span>
        <span>(${c.branch}) ${c.msg}</span>
      </div>
    `).join('');

    // Remote Repository
    dom.remoteBox.innerHTML = state.remoteCommits.map(c => `
      <div class="git-commit-node ${c.branch === 'feature' ? 'feature-branch' : ''}">
        <span class="git-commit-hash">${c.hash}</span>
        <span>(origin/${c.branch}) ${c.msg}</span>
      </div>
    `).join('');

    // Buttons state
    dom.btnAdd.disabled = state.working.length === 0;
    dom.btnCommit.disabled = state.staging.length === 0;
    
    // Check if there are local commits not yet on remote
    const unpushed = state.localCommits.filter(lc => !state.remoteCommits.some(rc => rc.hash === lc.hash));
    dom.btnPush.disabled = unpushed.length === 0;

    if (state.hasFeatureBranch) {
      dom.btnBranch.innerHTML = '<span>🔀</span> git merge feature';
    } else {
      dom.btnBranch.innerHTML = '<span>🌿</span> git checkout -b feature';
    }
  }

  function addTerminalLog(cmd, out, explanation) {
    dom.terminal.innerHTML = `
      <div class="git-term-line"><span class="git-term-prompt">$</span> ${cmd}</div>
      ${out ? `<div class="git-term-line git-term-out">${out}</div>` : ''}
    `;
    dom.explanation.innerHTML = explanation;
  }

  function handleAdd() {
    if (state.working.length === 0) return;
    state.staging = [...state.staging, ...state.working];
    const count = state.working.length;
    state.working = [];
    render();
    addTerminalLog(
      'git add .',
      `${count} arquivo(s) adicionado(s) para a Staging Area.`,
      '💡 <strong>git add .</strong> move suas alterações para o <em>palco</em> (Staging Area). Os arquivos continuam na sua máquina, mas agora o Git sabe exatamente quais arquivos devem entrar no próximo commit.'
    );
  }

  function handleCommit() {
    if (state.staging.length === 0) return;
    const count = state.staging.length;
    const randomHash = Math.random().toString(16).substring(2, 8);
    const msg = state.currentBranch === 'feature' ? 'feat: tela de login' : 'feat: layout e estilos';

    state.localCommits.unshift({
      hash: randomHash,
      msg: msg,
      branch: state.currentBranch
    });
    state.staging = [];
    render();

    addTerminalLog(
      `git commit -m "${msg}"`,
      `[${state.currentBranch} ${randomHash}] ${msg}\n ${count} files changed, 24 insertions(+)`,
      `💡 <strong>git commit</strong> empacota todos os arquivos do Staging e cria um registro permanente no histórico local (<code>.git</code>) com o hash <code>${randomHash}</code>. Nada foi enviado para a nuvem ainda!`
    );
  }

  function handlePush() {
    const unpushed = state.localCommits.filter(lc => !state.remoteCommits.some(rc => rc.hash === lc.hash));
    if (unpushed.length === 0) return;

    state.remoteCommits = JSON.parse(JSON.stringify(state.localCommits));
    render();

    addTerminalLog(
      `git push origin ${state.currentBranch}`,
      `Enumerating objects: 5, done.\nTo https://github.com/usuario/devstudy.git\n   ${unpushed[0].hash} -> ${state.currentBranch}`,
      '💡 <strong>git push</strong> envia todos os commits do seu repositório local para o servidor remoto (GitHub/GitLab). Agora sua equipe e o mundo têm acesso ao código!'
    );
  }

  function handleBranchOrMerge() {
    if (!state.hasFeatureBranch) {
      // Create and switch to feature branch
      state.hasFeatureBranch = true;
      state.currentBranch = 'feature';
      state.working = [
        { name: 'login.js', status: 'untracked', icon: '⚡' },
        { name: 'login.css', status: 'untracked', icon: '🎨' }
      ];
      render();

      addTerminalLog(
        'git checkout -b feature',
        `Switched to a new branch 'feature'`,
        '💡 <strong>git checkout -b feature</strong> criou uma ramificação paralela (branch). Você pode modificar arquivos sem afetar a <code>main</code>. Novos arquivos foram criados no seu Working Directory para você testar <code>git add</code> e <code>git commit</code>!'
      );
    } else {
      // Merge feature back into main
      state.currentBranch = 'main';
      state.hasFeatureBranch = false;
      const mergeHash = Math.random().toString(16).substring(2, 8);
      state.localCommits.unshift({
        hash: mergeHash,
        msg: `Merge branch 'feature'`,
        branch: 'main'
      });
      render();

      addTerminalLog(
        'git merge feature',
        `Updating main...\nFast-forward / Merge made by the 'recursive' strategy.`,
        '💡 <strong>git merge feature</strong> uniu todas as alterações da branch <code>feature</code> de volta na <code>main</code> com um nó de merge! Agora basta dar <code>git push</code> para publicar a junção.'
      );
    }
  }

  function handleReset() {
    state = {
      working: [
        { name: 'index.html', status: 'modified', icon: '📄' },
        { name: 'style.css', status: 'modified', icon: '🎨' },
        { name: 'app.js', status: 'untracked', icon: '⚡' }
      ],
      staging: [],
      localCommits: [
        { hash: 'e4f1a2', msg: 'initial commit', branch: 'main' }
      ],
      remoteCommits: [
        { hash: 'e4f1a2', msg: 'initial commit', branch: 'main' }
      ],
      currentBranch: 'main',
      hasFeatureBranch: false
    };
    render();
    addTerminalLog(
      'git status',
      'On branch main\nChanges not staged for commit:\n  modified: index.html\n  modified: style.css\nUntracked files:\n  app.js',
      '💡 O simulador foi reiniciado para o estado original. Teste clicar em <strong>git add .</strong> para começar o fluxo!'
    );
  }

  function init() {
    if (initElements()) {
      dom.btnAdd.addEventListener('click', handleAdd);
      dom.btnCommit.addEventListener('click', handleCommit);
      dom.btnPush.addEventListener('click', handlePush);
      dom.btnBranch.addEventListener('click', handleBranchOrMerge);
      dom.btnReset.addEventListener('click', handleReset);
      render();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
