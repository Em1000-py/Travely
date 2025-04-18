const initialBudget = 275;
let budget = parseFloat(localStorage.getItem('budget')) || initialBudget;
const extras = JSON.parse(localStorage.getItem('extras') || '[]');

const itinerary = [
  { day: 'Jour 1', activities: [
      { name: 'Castelo de São Jorge', cost: 15 },
      { name: 'Déambulation Alfama', cost: 0 },
      { name: 'Miradouro Santa Luzia', cost: 0 },
      { name: 'Soir Boteco da Fá', cost: 20 }
    ]
  },
  { day: 'Jour 2', activities: [
      { name: 'Mosteiro dos Jerónimos', cost: 12 },
      { name: 'Torre de Belém', cost: 8 },
      { name: 'Pasteis de Nata', cost: 1.3 },
      { name: 'LX Factory & Santos', cost: 20 }
    ]
  },
  { day: 'Jour 3', activities: [
      { name: 'Surf Costa da Caparica', cost: 30 },
      { name: 'Déjeuner Atlantique', cost: 15 },
      { name: 'Musée Berardo', cost: 0 },
      { name: 'Soir Bairro Alto', cost: 12 }
    ]
  },
  { day: 'Jour 4', activities: [
      { name: 'Shopping Baixa', cost: 0 },
      { name: 'Mercado da Ribeira / LX Factory', cost: 15 },
      { name: 'Option Sintra', cost: 24.9 },
      { name: 'Soir Lux Fragil', cost: 12 }
    ]
  },
];

function updateBudgetDisplay() {
  document.getElementById('remaining-budget').textContent = budget.toFixed(2);
  localStorage.setItem('budget', budget.toFixed(2));
}

function renderExtras() {
  const list = document.getElementById('cost-list');
  list.innerHTML = '';
  extras.forEach((ex, idx) => {
    const li = document.createElement('li');
    li.textContent = ex.category + ': ' + ex.amount.toFixed(2) + ' €';
    list.appendChild(li);
  });
}

function addCost() {
  const category = document.getElementById('cost-category').value.trim();
  const amount = parseFloat(document.getElementById('cost-amount').value);
  if (!category || isNaN(amount) || amount <= 0) return;
  budget -= amount;
  extras.push({ category, amount });
  localStorage.setItem('extras', JSON.stringify(extras));
  updateBudgetDisplay();
  renderExtras();
  document.getElementById('cost-category').value = '';
  document.getElementById('cost-amount').value = '';
}

function render() {
  updateBudgetDisplay();
  renderExtras();
  const container = document.getElementById('timeline');
  itinerary.forEach((dayObj, dayIndex) => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    const title = document.createElement('h2');
    title.textContent = dayObj.day;
    dayDiv.appendChild(title);

    dayObj.activities.forEach((act, actIndex) => {
      const actDiv = document.createElement('div');
      actDiv.className = 'activity';
      actDiv.dataset.key = `${dayIndex}-${actIndex}`;

      const info = document.createElement('span');
      info.textContent = act.name + ' (' + act.cost + ' €)';

      const btn = document.createElement('button');
      btn.textContent = '✓';
      btn.addEventListener('click', () => toggleDone(actDiv, dayIndex, actIndex));

      actDiv.appendChild(info);
      actDiv.appendChild(btn);

      if (localStorage.getItem(actDiv.dataset.key) === 'done') {
        actDiv.classList.add('done');
      }

      dayDiv.appendChild(actDiv);
    });

    container.appendChild(dayDiv);
  });
}

function toggleDone(actDiv, dIdx, aIdx) {
  const key = actDiv.dataset.key;
  const cost = itinerary[dIdx].activities[aIdx].cost;
  if (actDiv.classList.contains('done')) {
    actDiv.classList.remove('done');
    budget += cost;
    localStorage.removeItem(key);
  } else {
    actDiv.classList.add('done');
    budget -= cost;
    localStorage.setItem(key, 'done');
  }
  updateBudgetDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  render();
  document.getElementById('add-cost').addEventListener('click', addCost);
});
