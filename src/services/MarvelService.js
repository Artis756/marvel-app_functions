import useHttp from "../hooks/http.hook";

const useMarvelService = () => {
	const { loading, error, request } = useHttp()

	const _apikey = '70188d3e9736e22562d84fdd1a130aeb';
	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _baseOffset = 193;
	const _comicsOffset = 598;

	const getAllCharacters = async (offset = _baseOffset) => {
		const { data: { results } } = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apikey}`);

		return results.map(item => _transformCharData(item))
	}

	const getCharacter = async (id) => {
		const { data: { results } } = await request(`${_apiBase}characters/${id}?apikey=${_apikey}`);

		return _transformCharData(results[0])
	}

	const getAllComics = async (offset = _comicsOffset) => {
		const { data: { results } } = await request(`${_apiBase}comics?limit=8&offset=${offset}&apikey=${_apikey}`);
		return results.map(_transformComic)
	}
	const _transformCharData = (char) => {

		return {
			id: char.id,
			name: char.name,
			description: char.description.length === 0 ? "There is no description for this character" : char.description.length >= 210 ? char.description.slice(0, 210) + '...' : char.description,
			thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
			wiki: char.urls[0].url,
			homepage: char.urls[1].url,
			comics: char.comics.items.length !== 0 ? char.comics.items.slice(0, 10) : []
		}
	}

	const _transformComic = (comic) => {
		console.log(comic);
		return {
			id: comic.id,
			title: comic.title,
			price: comic.prices[0].price === 0 ? 'NOT AVAILABLE': comic.prices[0].price  +'$',
			thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`
		}
	}
	return { loading, error, getAllCharacters, getCharacter, getAllComics }
}

export default useMarvelService;