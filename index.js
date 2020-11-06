const container = document.querySelector('.container');
const loading = document.querySelector('.loading');

// store last document
let latestDoc = null;

const getNextReviews = async () => {
  loading.classList.add('active');
  const ref = db
    .collection('PRICES')
    .orderBy('Alloy')
    .startAfter(latestDoc || 0)
    .limit(7);

  const data = await ref.get();

  // output docs
  let template = '';
  data.docs.forEach((doc) => {
    const review = doc.data();
    template += `
      <div class="card">
        <h2>${review.Alloy}</h2>
        <p class="lead">Blend: ${review.Blend}</p>
        <p>Price: ${review.Price}</p>
      </div>
    `;
  });

  container.innerHTML += template;
  loading.classList.remove('active');

  // update latest doc
  latestDoc = data.docs[data.docs.length - 1];

  // unattach event listeners if no more docs
  if (data.empty) {
    loadMore.removeEventListener('click', handleClick);
    container.removeEventListener('scroll', handleScroll);
  }
};

// wait for DOM Content to load
window.addEventListener('DOMContentLoaded', () => getNextReviews());

// load more docs (button)
const loadMore = document.querySelector('.load-more button');

const handleClick = () => {
  getNextReviews();
};

loadMore.addEventListener('click', handleClick);

const handleScroll = () => {
  let triggerHeight = container.scrollTop + container.offsetHeight;
  if (triggerHeight >= container.scrollHeight) {
    getNextReviews();
  }
};

// load more docs (scroll)
container.addEventListener('scroll', handleScroll);
