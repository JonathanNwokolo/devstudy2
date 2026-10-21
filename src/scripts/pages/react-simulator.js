/**
 * DevStudy - React Virtual DOM & State Flow Simulator
 */

(function () {
  'use strict';

  let count = 0;
  let dom = {};

  function initElements() {
    dom.card = document.getElementById('reactSimulator');
    if (!dom.card) return false;

    dom.btnInc = dom.card.querySelector('#rsimBtnInc');
    dom.btnDec = dom.card.querySelector('#rsimBtnDec');
    dom.btnReset = dom.card.querySelector('#rsimBtnReset');

    dom.nodeCounter = dom.card.querySelector('#rsimNodeCounter');
    dom.nodeText = dom.card.querySelector('#rsimNodeText');
    dom.realDomNode = dom.card.querySelector('#rsimRealDomNumber');
    dom.diffStatus = dom.card.querySelector('#rsimDiffStatus');
    dom.explanation = dom.card.querySelector('#rsimExplanation');

    return true;
  }

  function updateState(newCount, actionName) {
    const oldCount = count;
    count = newCount;

    // Trigger Virtual DOM Diff highlight
    if (dom.nodeText) {
      dom.nodeText.classList.add('node-diff');
      dom.nodeText.innerHTML = `&lt;p&gt;Cliques: <strong>${count}</strong>&lt;/p&gt; <span class="rsim-changed-note">(MODIFICADO NO VDOM)</span>`;
    }

    if (dom.diffStatus) {
      dom.diffStatus.textContent = `⚡ Diffing: 1 alteração detectada (de ${oldCount} para ${count})`;
      dom.diffStatus.classList.add('is-diffing');
    }

    if (dom.explanation) {
      dom.explanation.innerHTML = `
        🔄 <strong>${actionName}:</strong> O React executou o componente <code>Contador</code> e gerou uma nova árvore Virtual DOM na memória.
        Comparando com a árvore anterior (<em>diffing</em>), apenas o nó <code>&lt;p&gt;</code> teve seu valor alterado. O <code>&lt;App /&gt;</code>, <code>&lt;Header /&gt;</code> e <code>&lt;Footer /&gt;</code> foram reaproveitados intactos!
      `;
    }

    // Apply to Real DOM with animation
    setTimeout(() => {
      if (dom.realDomNode) {
        dom.realDomNode.textContent = count;
        dom.realDomNode.parentElement.classList.add('node-real-dom-update');
      }

      if (dom.diffStatus) {
        dom.diffStatus.textContent = '✅ DOM Real reconciliado: apenas 1 mutação executada!';
        dom.diffStatus.classList.remove('is-diffing');
      }

      setTimeout(() => {
        if (dom.nodeText) dom.nodeText.classList.remove('node-diff');
        if (dom.realDomNode) dom.realDomNode.parentElement.classList.remove('node-real-dom-update');
      }, 700);
    }, 400);
  }

  function init() {
    if (initElements()) {
      dom.btnInc.addEventListener('click', () => {
        updateState(count + 1, 'setCount(count + 1)');
      });

      dom.btnDec.addEventListener('click', () => {
        updateState(count - 1, 'setCount(count - 1)');
      });

      dom.btnReset.addEventListener('click', () => {
        updateState(0, 'setCount(0)');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
