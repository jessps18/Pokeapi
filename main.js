'use strict';

let offset = 0;
const limit = 50;
let carregando = false;

async function PegarPokemon() {
    if (carregando) return;
    carregando = true;

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();
    const listagemPoke = data.results;

    for (const pokemon of listagemPoke) {
        const detalhe = await fetch(pokemon.url);
        const info = await detalhe.json();
        criarCard(info);
    }

    offset += limit;
    carregando = false;
}

function criarCard(info) {
    const nome = info.name;
    const img = info.sprites.front_default;
    const tipo = info.types[0].type.name;

    const card = document.createElement('div');
    card.classList.add('card', tipo);

    card.innerHTML = `
        <div class="conteudo">
            <h3>${nome}</h3>
            <img src="${img}" alt="${nome}">
        </div>
    `;

    document.querySelector('#cards').appendChild(card);
}

// Detecta rolagem no container de cards
document.querySelector('.cards').addEventListener('scroll', () => {
    const cards = document.querySelector('.cards');
    const nearBottom = cards.scrollTop + cards.clientHeight >= cards.scrollHeight - 100;

    if (nearBottom) {
        PegarPokemon();
    }
});

// Carrega os primeiros
PegarPokemon();
