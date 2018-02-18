document.addEventListener("DOMContentLoaded", () => {
    const hnRoot = document.querySelector('.js-hn-root')
    const hnTop = hnRoot.querySelector('.js-hn-top')
    const hnNew = hnRoot.querySelector('.js-hn-new')
    const hnBest = hnRoot.querySelector('.js-hn-best')
    const hnResults = hnRoot.querySelector('.js-hn-results')
    const allBtns = [hnTop, hnNew, hnBest]
  
    hnTop.addEventListener('click', () => switchTo('top', hnTop))
    hnNew.addEventListener('click', () => switchTo('new', hnNew))
    hnBest.addEventListener('click', () => switchTo('best', hnBest))
    
    switchTo('top', hnTop)
  
    function switchTo(type, btn) {
      function startLoading() {
        allBtns.forEach(btn => {
          btn.classList.remove('active', 'loading')
          btn.disabled = true
        })
        btn.classList.add('loading')
      }
  
      function cleanUp() {
        allBtns.forEach(btn => {
          btn.classList.remove('active', 'loading')
          btn.disabled = false
        })
      }
  
      startLoading()
      const loading = getStories(type)
        .then(stories => {
          const html = `<ol>${stories.map(s => `<li>${renderStory(s)}</li>`).join('')}</ol>`
          hnResults.innerHTML = html
        })
        .then(() => {
          cleanUp()
          btn.classList.add('active')
        }, () => {
          cleanUp()
          hnResults.innerHTML = `Error while loading :(`
        })
    }
  
    function getStories(type) {
      return fetch(`https://hacker-news.firebaseio.com/v0/${type}stories.json?print=pretty`)
        .then(res => res.json())
        .then(stories => {
          const firstFive = stories.slice(0, 5)
          const promises = firstFive.map(id => {
            return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
              .then(res => res.json())
          })
          return Promise.all(promises)
        })
    }
  
    function renderStory(story) {
      return `
          <div>
            <p class="hn-story__title">${story.title}</p>
            ~ <a class="hn-story__author" href="https://news.ycombinator.com/user?id=${story.by}">${story.by}</a>
        </div>
      `
    }
  
  });
  