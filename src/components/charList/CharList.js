import './charList.scss';
import { Component, useEffect, useRef, useState } from 'react';
import Spinner from '../spinner/spinner';
import Error from '../error/error';

import PropTypes from 'prop-types'
import useMarvelService from '../../services/MarvelService';

const CharList = ({ onCharSelected }) => {
	const [chars, setChars] = useState([]);
	const [newItemsLoading, setNewItemsLoading] = useState(false);
	const [offset, setOffset] = useState(193);
	const [charsEnded, setCharsEnded] = useState(false);

	let itemsRefs = useRef([]);
	const { error, loading, getAllCharacters } = useMarvelService();

	const onCharsLoaded = (newChars) => {
		let ended = false;
		if (newChars.length < 9) {
			ended = true
		}

		setOffset(offset => offset + 9);
		setChars(chars => [...chars, ...newChars])
		setNewItemsLoading(false);
		setCharsEnded(ended)

	}

	const onError = () => {
		setNewItemsLoading(false);
	}

	const onRequest = (initial) => {
		initial ? setNewItemsLoading(false) : setNewItemsLoading(true)

		getAllCharacters(offset)
			.then(onCharsLoaded)
			.catch(onError)
	}

	useEffect(() => {
		onRequest(true);
	}, [])

	useEffect(() => {
		return () => itemsRefs = null;
	})

	const onFocus = (index) => {
		itemsRefs.current.map(item => item.classList.remove('char__item_selected'))
		itemsRefs.current[index].classList.add('char__item_selected')
	}

	const createItems = (chars) => {
		const keyboardHandler = (e, index, id) => {
			if (e.code === 'Space' || e.code === 'Enter') {
				e.preventDefault();
				onFocus(index);
				onCharSelected(id);
			}
		}

		return chars.map((item, index) => {
			return (
				<li className="char__item"
					onClick={() => { onCharSelected(item.id); onFocus(index) }}
					onKeyDown={(e) => keyboardHandler(e, index, item.id)}
					tabIndex="0"
					key={item.id}
					ref={elem => itemsRefs.current[index] = elem}>
					<img src={item.thumbnail} alt="abyss" />
					<div className="char__name">{item.name}</div>
				</li>
			)
		})
	}

	const items = createItems(chars)

	const loadingComponent = loading && !newItemsLoading ? <Spinner /> : null;
	const errorComponent = error ? <Error /> : null;

	return (
		<div className="char__list">
			{loadingComponent}
			{errorComponent}
			<ul className="char__grid">
				{items}
			</ul>
			<button className="button button__main button__long"
				disabled={newItemsLoading}
				onClick={() => onRequest(false)}
				style={{ display: charsEnded ? 'none' : 'block' }}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;