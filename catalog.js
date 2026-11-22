const cards = [...document.querySelectorAll('.cards article')];
const filters = ['topic', 'group'].map((key) => ({
  key,
  element: document.getElementById(key)
}));
const empty = document.getElementById('empty');
const query = new URLSearchParams(location.search);

for (const {key, element} of filters) {
  const values = [...new Set(cards.map((card) => card.dataset[key]))];
  values.sort((a, b) => a.localeCompare(b, 'ru'));
  for (const value of values) element.add(new Option(value, value));
  if (values.includes(query.get(key))) element.value = query.get(key);
  element.addEventListener('change', () => {
    for (const filter of filters) {
      if (filter.element.value) query.set(filter.key, filter.element.value);
      else query.delete(filter.key);
    }
    const url = new URL(location.href);
    url.search = query.toString();
    history.replaceState(null, '', url);
    render();
  });
}

function render() {
  let visible = 0;
  for (const card of cards) {
    card.hidden = !filters.every(({key, element}) => !element.value || card.dataset[key] === element.value);
    if (!card.hidden) visible += 1;
  }
  empty.textContent = cards.length ? 'По этим фильтрам тестов нет.' : 'Тесты пока не добавлены.';
  empty.hidden = visible > 0;
}

document.querySelector('.filters').hidden = cards.length === 0;
render();
