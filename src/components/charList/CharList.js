import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import Error from '../error/error';

import PropTypes from 'prop-types'
class CharList extends Component {
	state = {
		chars: [],
		loading: true,
		error: false,
		newItemsLoading: false,
		offset: 193,
		charsEnded: false
	}
	itemsRefs = [];
	marvelService = new MarvelService();

	onCharsLoading = () => {
		this.setState({ newItemsLoading: true, error: false })
	}

	onCharsLoaded = (newChars) => {
		let ended = false;
		if (newChars.length < 9) {
			ended = true
		}

		this.setState(({ chars, offset }) => ({
			chars: [...chars, ...newChars],
			loading: false,
			newItemsLoading: false,
			offset: offset + 9,
			charsEnded: ended
		}))
	}

	onError = () => {
		this.setState({ loading: false, error: true, newItemsLoading: false })
	}

	onRequest = () => {
		this.onCharsLoading();
		this.marvelService
			.getAllCharacters(this.state.offset)
			.then(this.onCharsLoaded)
			.catch(this.onError)
	}

	componentDidMount() {
		this.onRequest();
	}

	componentWillUnmount() {
		this.itemsRefs = null;
	}

	onFocus = (index) => {
		this.itemsRefs.map(item => item.classList.remove('char__item_selected'))
		this.itemsRefs[index].classList.add('char__item_selected')
	}

	itemRef = elem => { this.itemsRefs.push(elem) }

	createItems = (chars) => {
		const { onCharSelected } = this.props;
		const keyboardHandler = (e, index, id) => {
			if (e.code === 'Space' || e.code === 'Enter') {
				e.preventDefault();
				this.onFocus(index);
				onCharSelected(id);
			}
		}

		return chars.map((item, index) => {
			return (
				<li className="char__item"
					onClick={() => { onCharSelected(item.id); this.onFocus(index) }}
					onKeyDown={(e) => keyboardHandler(e, index, item.id)}
					tabIndex="0"
					key={item.id}
					ref={this.itemRef}>
					<img src={item.thumbnail} alt="abyss" />
					<div className="char__name">{item.name}</div>
				</li>
			)
		})
	}

	render() {
		const { chars, loading, error, newItemsLoading, offset, charsEnded } = this.state;

		const items = this.createItems(chars)

		const loadingComponent = loading ? <Spinner /> : null;
		const errorComponent = error ? <Error /> : null;
		const content = !(loadingComponent || errorComponent) ? items : null;

		return (
			<div className="char__list">
				{loadingComponent}
				{errorComponent}
				<ul className="char__grid">
					{content}
				</ul>
				<button className="button button__main button__long"
					disabled={newItemsLoading}
					onClick={() => this.onRequest(offset)}
					style={{ display: charsEnded ? 'none' : 'block' }}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;