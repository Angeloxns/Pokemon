const formulario = document.getElementById("formPoke");
const msg = document.getElementById("msg");
const resultado = document.getElementById("resultado");

const regioes = {
    '1': 'Kanto',
    '2': 'Johto',
    '3': 'Hoenn',
    '4': 'Sinnoh',
    '5': 'Unova',
    '6': 'Kalos',
    '7': 'Alola',
    '8': 'Galar',
    '9': 'Paldea'
};

formulario.addEventListener("submit", async function(evento){
    evento.preventDefault();

    const id = document.getElementById("idPoke").value;

    try {
        msg.textContent = "Carregando...";
        resultado.style.display = "none";

        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        
        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado");
        }

        const pokemon = await resposta.json();

        const especieResposta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const especie = await especieResposta.json();

        const geracaoNum = especie.generation.url.split('/')[6];
        const regiao = regioes[geracaoNum] || 'Desconhecida';

        document.getElementById('nomePokemon').textContent = pokemon.name;
        document.getElementById('imgPoke').src = pokemon.sprites.front_default;
        document.getElementById('peso').textContent = `Peso: ${pokemon.weight / 10} kg`;
        document.getElementById('altura').textContent = `Altura: ${pokemon.height / 10} m`;
        document.getElementById('tipo').textContent = `Tipo: ${pokemon.types.map(t => t.type.name).join(', ')}`;
        document.getElementById('regiao').textContent = `Região: ${regiao}`;

        msg.textContent = "";
        resultado.style.display = "flex";

        // Tocar som automaticamente quando o Pokémon aparecer (grito clássico dos jogos)
        const cryUrl = pokemon.cries?.legacy || pokemon.cries?.latest;
        if (cryUrl) {
            const audio = new Audio(cryUrl);
            audio.play().catch(erro => {
                console.error('Erro ao reproduzir som automático:', erro);
            });
        }

        // Botão para tocar som novamente
        const somButton = document.getElementById('somPokemon');
        somButton.onclick = () => {
            const soundUrl = pokemon.cries?.legacy || pokemon.cries?.latest;
            if (soundUrl) {
                const audio = new Audio(soundUrl);
                audio.play().catch(erro => {
                    console.error('Erro ao reproduzir som:', erro);
                    alert('Não foi possível reproduzir o som. Tente clicar novamente.');
                });
            } else {
                alert('Som não disponível para este Pokémon.');
            }
        };

    } catch (erro) {
        msg.textContent = erro.message;
        resultado.style.display = "none";
        console.error('Erro ao buscar Pokémon:', erro);
    }
});