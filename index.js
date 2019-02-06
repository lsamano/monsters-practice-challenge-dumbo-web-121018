document.addEventListener("DOMContentLoaded", function(){
  const createMonster = document.getElementById("create-monster")
  const monsterContainer = document.getElementById("monster-container")
  const createMonsterForm = document.querySelector("#create-monster-form")
  const forward = document.getElementById("forward")
  const back = document.getElementById("back")
  let lastPage = false;

  // Functions Below

  // Fetch to populate Page 1
  const fetchTheMonsters = () => {
    return fetch("http://localhost:3000/monsters")
    .then(response => response.json())
    .then(data => {
      const fiftyMonsters = data.slice(0, 50)
      monsterContainer.dataset.id = 0;
      showFiftyMonsters(fiftyMonsters);
    })
  }

  // Helper to print 50 to the Monster Container
  const showFiftyMonsters = fiftyMonsters => {
    let bigString = ""
    fiftyMonsters.forEach(monster => {
      string = `
            <h2>${monster.id}. ${monster.name}</h2>
            <h4>${monster.age}</h4>
            <p>${monster.description}</p>`
       bigString += string;
    }) // End of data.forEach
    monsterContainer.innerHTML = bigString
  }

  const addEventToSubmit = () => {
    createMonsterForm.addEventListener("submit", addNewMonster)
  }

  const scrapeInfoFromForm = (form) => {
    const name = form.querySelector(".name").value
    const age = form.querySelector(".age").value
    const description = form.querySelector(".description").value
    return {name: name, age: age, description: description}
  }

  const updateDomWithNewMonster = monster => {
    string = `
      <h2>${monster.id}. ${monster.name}</h2>
      <h4>${monster.age}</h4>
      <p>${monster.description}</p>`
    monsterContainer.innerHTML += string;
  }

  const postFetch = newMonster => {
    return fetch("http://localhost:3000/monsters", {
      method: "POST",
      body: JSON.stringify(newMonster),
      headers: {
        "Content-Type": "application/json"
      }
    }) // end of fetch
    .then(response => response.json())
    .then(data => {
      if (lastPage === true) {
        updateDomWithNewMonster(data)
      }
    })
  }

  const addNewMonster = event => {
    event.preventDefault();
    // Take info on form, make it an object
    const newMonsterObject = scrapeInfoFromForm(event.target)

    // send it as a POST fetch
    postFetch(newMonsterObject);
  }

  const forwardCallback = event => {
    if (lastPage === true) {
      return
    }
    monsterContainer.dataset.id = parseInt(monsterContainer.dataset.id) + 1
    const start = parseInt(monsterContainer.dataset.id) * 50
    const end = start + 50

    fetch("http://localhost:3000/monsters")
    .then(response => response.json())
    .then(data => {
      const fiftyMonsters = data.slice(start, end)

      if (fiftyMonsters.length < 50) {
        lastPage = true;
      }
      showFiftyMonsters(fiftyMonsters);
    })
  }
  const addEventToForward = () => {
    forward.addEventListener("click", forwardCallback)
  }

  const backCallback = event => {
    if (monsterContainer.dataset.id === "0") {
      return
    } else if (lastPage === true) {
      lastPage = false;
    }
    monsterContainer.dataset.id = parseInt(monsterContainer.dataset.id) - 1
    const start = parseInt(monsterContainer.dataset.id) * 50
    const end = start + 50

    fetch("http://localhost:3000/monsters")
    .then(response => response.json())
    .then(data => {
      const fiftyMonsters = data.slice(start, end)
      showFiftyMonsters(fiftyMonsters);
    })
  }
  const addEventToBackward = () => {
    back.addEventListener("click", backCallback)
  }

  // Run functions for onPageLoad
  addEventToSubmit();
  addEventToForward();
  addEventToBackward();
  fetchTheMonsters();
  // End of DOMContentLoaded
})
