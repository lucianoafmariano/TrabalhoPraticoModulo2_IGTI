const fs = require('fs');
let globalAllStates = [];
let sumMoreCities = 0;
let sumLessCities = 0;

const readAllJsonFiles = () => {
  fs.readFile('Cidades.json', (err, data) => {
    if (err) {
      console.log('Erro ao ler as cidades');
    }
    const allCities = JSON.parse(data);

    fs.readFile('Estados.json', (err, data) => {
      if (err) {
        console.log('Erro ao ler os estados');
      }
      const allStates = JSON.parse(data);
      globalAllStates = allStates;

      allStates.forEach((state) => {
        if (fs.readdirSync(`States`).length >= 27) {
          return;
        } else {
          createStateFiles(state, allCities);
        }
      });
    });
  });
};

const createStateFiles = (states, allCities) => {
  // variável vai fazer um filtro nas cidades lidas acima e verificar nelas o estado e criar um array
  const mergeCitiesAndStates = allCities.filter(
    (city) => city.Estado === states.ID
  );

  fs.writeFile(
    `States/${states.Sigla}.json`,
    JSON.stringify(mergeCitiesAndStates),
    (err) => {
      if (err) {
        console.log('Erro ao gerar os arquivos');
      }
      return;
    }
  );
};

// Função que busca a cidade por estado com parametro ou todas sem parametro
const citiesForStateParams = (state) => {
  if (state) {
    citiesForState(state);
  } else {
    citiesforAllStates();
  }
};

function citiesforAllStates() {
  const readStates = fs.readFileSync(`Estados.json`);
  const statesParsed = JSON.parse(readStates);
  const statesWithCities = statesParsed.map((state) => ({
    state: state.Sigla,
    cities: citiesForState(state.Sigla),
  }));
  return statesWithCities;
}

const citiesForState = (state) => {
  const readStates = fs.readFileSync(`States/${state}.json`);
  // O método JSON.parse() analisa uma string JSON, construindo o valor ou um objeto JavaScript descrito pela string
  const statesParsed = JSON.parse(readStates);

  //console.log(`${state} possui ${countCitiesParsed.length} cidade(s)`);

  const totalCities = statesParsed.length;
  // Se não tiver esse retorno a quantidade de cidades fica indefinida
  return totalCities;
};

const statesWithMoreCities = () => {
  const readStates = fs.readFileSync(`Estados.json`);
  const statesParsed = JSON.parse(readStates);
  const countStatesWithCities = statesParsed.map((state) => ({
    uf: state.Sigla,
    cities: citiesForState(state.Sigla),
  }));

  const orderedCities = countStatesWithCities.sort((b, a) => {
    if (a.cities < b.cities) {
      return -1;
    } else if (a.cities > b.cities) {
      return 1;
    }
    return 0;
  });
  // O método slice() retorna uma cópia de parte de um array a partir de um subarray criado entre as posições início(begin) e fim(end)(fim não é necessário) de um array original. O Array original não é modificado.

  const newOrderedCities = orderedCities.slice(0, 5);

  console.log(newOrderedCities);
  sumMoreCities = newOrderedCities.reduce(
    (acc, state) => acc + state.cities,
    0
  );
  return newOrderedCities;
};

const statesWithLessCities = () => {
  const readStates = fs.readFileSync(`Estados.json`);
  const statesParsed = JSON.parse(readStates);
  const countStatesWithCities = statesParsed.map((state) => ({
    uf: state.Sigla,
    cities: citiesForState(state.Sigla),
  }));

  const orderedCities = countStatesWithCities.sort((a, b) => {
    if (a.cities < b.cities) {
      return -1;
    } else if (a.cities > b.cities) {
      return 1;
    }
    return 0;
  });

  const newOrderedCities = orderedCities.slice(0, 5);
  console.log(newOrderedCities);

  sumLessCities = newOrderedCities.reduce(
    (acc, state) => acc + state.cities,
    0
  );
  return newOrderedCities;
};

// Função criada para ser chamada e não executada diretamente
// Ela recebe os parametros, no caso esse state diretamente da função que chamar ela
const cityReceiveState = (state) => {
  // Lê as cidades do arquivo json e faz o parse pra vetor
  const readCities = fs.readFileSync(`Cidades.json`);
  const citiesParsed = JSON.parse(readCities);
  //  Recebe as cidades de acordo com o estado passado
  const stateCities = citiesParsed
    // Filtra se o id do estado é igual ao estado passado
    .filter((city) => city.Estado === state.ID)
    // Cria um novo array com os dados recebidos do filter
    .map((city) => city.Nome);
  const sortedCities = stateCities
    // Ordena e compara
    .sort((a, b) => {
      if (a.length > b.length) return 1;
      if (a.length < b.length) return -1;
      return 0;
    })
    .reverse();

  return sortedCities[0];
};

const cityWithLargNameAllStates = () => {
  // Le o arquivo de estados e passa ele pra cityReceiveStates quando é chamada abaixo
  const readStates = fs.readFileSync(`Estados.json`);
  const statesParsed = JSON.parse(readStates);

  // Cria um novo array com o retorno da chamada e a concatenação
  const largestNamesCities = statesParsed.map(
    // Chamada da função que retorna os estados
    (state) => `${cityReceiveState(state)} - ${state.Sigla}`
  );

  console.log(largestNamesCities);
};

const cityWithLargeName = () => {
  const readStates = fs.readFileSync(`Estados.json`);
  const statesParsed = JSON.parse(readStates.toString());

  const largestNamesCities = statesParsed.map(
    (state) => `${cityReceiveState(state)} - ${state.Sigla}`
  );

  const largestNameCity = largestNamesCities.sort().sort((a, b) => {
    if (a.length > b.length) return -1;
    if (a.length < b.length) return 1;
    return 0;
  })[0];

  console.log(largestNameCity);
};

const cityWithSmallName = () => {};

const cityWithSmallNameAllStates = () => {};

const sumStateWithMoreCities = () => {
  console.log(sumMoreCities);
};

const sumStateWithLessCities = () => {
  console.log(sumLessCities);
};

/** ------------------------ Saídas --------------------------- */
// readAllJsonFiles();

console.log('Item 2 - Quantidade de Cidade por Estado.');
citiesForStateParams('MG');
citiesForStateParams();
console.log(
  '_____________________________________________________________________________________________________'
);

console.log('Item 3 - Os 5 Estados com mais cidades.');
statesWithMoreCities();
console.log(
  '_____________________________________________________________________________________________________'
);

console.log('Item 4 - Os 5 Estados com menos cidades.');
statesWithLessCities();
console.log(
  '_____________________________________________________________________________________________________'
);

console.log('Item 5 - Cidade com maior nome de cada estado.');
cityWithLargNameAllStates();
console.log(
  '_____________________________________________________________________________________________________'
);

console.log('Item 6 - Cidade de menor nome de cada estado.');
cityWithSmallName();
console.log(
  '_____________________________________________________________________________________________________'
);

console.log('Item 7 - Cidade de maior nome entre todos os estados.');
cityWithLargeName();
console.log(
  '_____________________________________________________________________________________________________'
);

console.log('Item 8 - Cidade de menor nome entre todos os estados.');
cityWithSmallNameAllStates();
console.log(
  '_____________________________________________________________________________________________________'
);

console.log('Item 9 - Soma das cidades dos cinco estados com mais cidades.');
sumStateWithMoreCities();
console.log(
  '_____________________________________________________________________________________________________'
);
console.log('Item 10 - Soma das cidades dos cinco estados com menos cidades.');
sumStateWithLessCities();
console.log(
  '_____________________________________________________________________________________________________'
);
