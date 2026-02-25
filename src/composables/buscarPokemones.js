import { ref } from 'vue';
import axios from 'axios';


export function buscarPokemones(limit = 152){
  // definimos referencias reactivas para su uso
  const pokemones = ref([])
  const loading = ref(false)
  const error = ref(null);

  const traerDatos = async () => {
    loading.value = true;
    try {
      const respuesta = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const promesas = respuesta.data.results.map(async (pokemon) => {
        const pokemonData = await axios.get(pokemon.url);
        return {
          name: pokemonData.data.name,
          image: pokemonData.data.sprites.other['official-artwork'].front_default,
          type: pokemonData.data.types[0].type.name,
        };
      });
      pokemones.value = await Promise.all(promesas);
    } catch (err) {
      console.log(err)
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {pokemones, loading, error, traerDatos} // se devuelve los valores elegidos.
}


