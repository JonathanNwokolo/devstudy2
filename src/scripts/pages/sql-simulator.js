/**
 * DevStudy - SQL JOINs Interactive Visualizer
 */

(function () {
  'use strict';

  const USERS = [
    { id: 1, nome: 'Ana' },
    { id: 2, nome: 'Bruno' },
    { id: 3, nome: 'Carla' }
  ];

  const ORDERS = [
    { id: 101, usuario_id: 1, valor: 'R$ 150' },
    { id: 102, usuario_id: 1, valor: 'R$ 80' },
    { id: 103, usuario_id: 2, valor: 'R$ 300' },
    { id: 104, usuario_id: 99, valor: 'R$ 50' }
  ];

  const JOINS_DATA = {
    INNER: {
      type: 'INNER JOIN',
      vennLeft: '#cbd5e1',
      vennCenter: '#10b981',
      vennRight: '#cbd5e1',
      activeUsers: [1, 2],
      activeOrders: [101, 102, 103],
      rows: [
        { uId: 1, nome: 'Ana', pId: 101, valor: 'R$ 150' },
        { uId: 1, nome: 'Ana', pId: 102, valor: 'R$ 80' },
        { uId: 2, nome: 'Bruno', pId: 103, valor: 'R$ 300' }
      ],
      explanation: '💡 <strong>INNER JOIN:</strong> Retorna estritamente os registros que possuem correspondência em <em>ambas</em> as tabelas. Carla (sem pedidos) e o Pedido 104 (sem usuário correspondente) foram descartados.'
    },
    LEFT: {
      type: 'LEFT JOIN',
      vennLeft: '#3b82f6',
      vennCenter: '#3b82f6',
      vennRight: '#cbd5e1',
      activeUsers: [1, 2, 3],
      activeOrders: [101, 102, 103],
      rows: [
        { uId: 1, nome: 'Ana', pId: 101, valor: 'R$ 150' },
        { uId: 1, nome: 'Ana', pId: 102, valor: 'R$ 80' },
        { uId: 2, nome: 'Bruno', pId: 103, valor: 'R$ 300' },
        { uId: 3, nome: 'Carla', pId: null, valor: null }
      ],
      explanation: '💡 <strong>LEFT JOIN:</strong> Retorna <em>todos</em> os registros da tabela da esquerda (<code>usuarios</code>). Como Carla não possui pedidos, as colunas do pedido vêm preenchidas com <strong class="sql-null-val">NULL</strong>.'
    },
    RIGHT: {
      type: 'RIGHT JOIN',
      vennLeft: '#cbd5e1',
      vennCenter: '#8b5cf6',
      vennRight: '#8b5cf6',
      activeUsers: [1, 2],
      activeOrders: [101, 102, 103, 104],
      rows: [
        { uId: 1, nome: 'Ana', pId: 101, valor: 'R$ 150' },
        { uId: 1, nome: 'Ana', pId: 102, valor: 'R$ 80' },
        { uId: 2, nome: 'Bruno', pId: 103, valor: 'R$ 300' },
        { uId: null, nome: null, pId: 104, valor: 'R$ 50' }
      ],
      explanation: '💡 <strong>RIGHT JOIN:</strong> Retorna <em>todos</em> os registros da tabela da direita (<code>pedidos</code>). O pedido 104 (com usuario_id 99 inexistente) é incluído com o usuário preenchido com <strong class="sql-null-val">NULL</strong>.'
    },
    FULL: {
      type: 'FULL OUTER JOIN',
      vennLeft: '#f59e0b',
      vennCenter: '#f59e0b',
      vennRight: '#f59e0b',
      activeUsers: [1, 2, 3],
      activeOrders: [101, 102, 103, 104],
      rows: [
        { uId: 1, nome: 'Ana', pId: 101, valor: 'R$ 150' },
        { uId: 1, nome: 'Ana', pId: 102, valor: 'R$ 80' },
        { uId: 2, nome: 'Bruno', pId: 103, valor: 'R$ 300' },
        { uId: 3, nome: 'Carla', pId: null, valor: null },
        { uId: null, nome: null, pId: 104, valor: 'R$ 50' }
      ],
      explanation: '💡 <strong>FULL OUTER JOIN:</strong> Combina o LEFT e RIGHT JOIN. Retorna todos os registros de ambos os lados, preenchendo com <strong class="sql-null-val">NULL</strong> em qualquer lado que não tenha par.'
    }
  };

  let dom = {};

  function initElements() {
    dom.card = document.getElementById('sqlSimulator');
    if (!dom.card) return false;

    dom.tabs = dom.card.querySelectorAll('.sql-tab-btn');
    dom.usersTbody = dom.card.querySelector('#sqlUsersTbody');
    dom.ordersTbody = dom.card.querySelector('#sqlOrdersTbody');
    dom.resultsTbody = dom.card.querySelector('#sqlResultsTbody');
    dom.resultCount = dom.card.querySelector('#sqlResultCount');
    dom.queryDisplay = dom.card.querySelector('#sqlQueryCode');
    dom.explanation = dom.card.querySelector('#sqlExplanation');

    dom.vennCircleA = dom.card.querySelector('#vennCircleA');
    dom.vennCircleB = dom.card.querySelector('#vennCircleB');
    dom.vennIntersection = dom.card.querySelector('#vennIntersection');

    return true;
  }

  function render(joinKey) {
    const data = JOINS_DATA[joinKey];
    if (!data) return;

    // Tabs
    dom.tabs.forEach(t => {
      if (t.getAttribute('data-join') === joinKey) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Render Source Users Table
    dom.usersTbody.innerHTML = USERS.map(u => {
      const isMatched = data.activeUsers.includes(u.id);
      return `
        <tr class="${isMatched ? 'sql-row-highlight' : 'sql-row-dim'}">
          <td><strong>${u.id}</strong></td>
          <td>${u.nome}</td>
        </tr>
      `;
    }).join('');

    // Render Source Orders Table
    dom.ordersTbody.innerHTML = ORDERS.map(p => {
      const isMatched = data.activeOrders.includes(p.id);
      return `
        <tr class="${isMatched ? 'sql-row-highlight' : 'sql-row-dim'}">
          <td><strong>${p.id}</strong></td>
          <td>${p.usuario_id}</td>
          <td>${p.valor}</td>
        </tr>
      `;
    }).join('');

    // Venn Diagram update
    if (dom.vennCircleA && dom.vennCircleB && dom.vennIntersection) {
      dom.vennCircleA.setAttribute('fill', data.vennLeft);
      dom.vennIntersection.setAttribute('fill', data.vennCenter);
      dom.vennCircleB.setAttribute('fill', data.vennRight);
    }

    // Query text
    dom.queryDisplay.innerHTML = `
      <span class="sql-kw">SELECT</span> u.id, u.nome, p.id <span class="sql-kw">AS</span> pedido_id, p.valor<br>
      <span class="sql-kw">FROM</span> <span class="sql-table">usuarios</span> u<br>
      <span class="sql-join-kw">${data.type}</span> <span class="sql-table">pedidos</span> p <span class="sql-kw">ON</span> u.id = p.usuario_id;
    `;

    // Result Table
    dom.resultCount.textContent = `${data.rows.length} linha(s) retornada(s)`;
    dom.resultsTbody.innerHTML = data.rows.map(r => `
      <tr>
        <td>${r.uId !== null ? `<strong>${r.uId}</strong>` : '<span class="sql-null-val">NULL</span>'}</td>
        <td>${r.nome !== null ? r.nome : '<span class="sql-null-val">NULL</span>'}</td>
        <td>${r.pId !== null ? `<strong>${r.pId}</strong>` : '<span class="sql-null-val">NULL</span>'}</td>
        <td>${r.valor !== null ? r.valor : '<span class="sql-null-val">NULL</span>'}</td>
      </tr>
    `).join('');

    // Explanation
    dom.explanation.innerHTML = data.explanation;
  }

  function init() {
    if (initElements()) {
      dom.tabs.forEach(t => {
        t.addEventListener('click', () => {
          const key = t.getAttribute('data-join');
          render(key);
        });
      });
      render('INNER');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
