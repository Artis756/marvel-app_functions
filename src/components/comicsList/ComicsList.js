import './comicsList.scss';

import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/spinner';
import Error from '../error/error';
import { Link } from 'react-router-dom';


const ComicsList = () => {
	const { getAllComics, error, loading } = useMarvelService()
	const [offset, setOffset] = useState(598);
	const [comics, setComics] = useState([]);
	const [newComicsLoading, setNewComicsLoading] = useState(false);
	const [comicsEnded, setComicsEnded] = useState(false);

	useEffect(() => {
		updateComics(true);
	}, [])

	const updateComics = (initial) => {
		initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
		getAllComics(offset)
			.then(onComicsLoaded)
	}

	const onComicsLoaded = (newComics) => {
		let ended = false;
		if (newComics.length < 8) {
			ended = true;
		}

		setComics(comics => [...comics, ...newComics])
		setOffset(offset => offset + 8)
		setComicsEnded(ended);
		setNewComicsLoading(false);
	}

	const items = comics.map(comic => <View {...comic} key={comic.id} />)

	const loadingComponent = loading && !newComicsLoading ? <Spinner /> : null;
	const errorComponent = error ? <Error /> : null;

	return (
		<div className="comics__list">
			{loadingComponent}
			{errorComponent}
			<ul className="comics__grid">
				{items}
			</ul>
			<button className="button button__main button__long"
				onClick={() => updateComics(false)}
				disabled={newComicsLoading}
				style={{ display: comicsEnded ? 'none' : 'block' }}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

const View = ({ title, thumbnail, price, id }) => {
	return (
		<li className="comics__item">
			<Link to={`/comics/${id}`}>
				<img src={thumbnail} alt="x-men" className="comics__item-img" />
				<div className="comics__item-name">{title}</div>
				<div className="comics__item-price">{price}</div>
			</Link>
		</li>
	)
}

export default ComicsList;