import './charInfo.scss';

import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import Error from '../error/error';
import Skeleton from '../skeleton/Skeleton';

import PropTypes from 'prop-types'
class CharInfo extends Component {
	state = {
		char: {},
		loading: false,
		error: false,
		skeleton: true
	}

	marvelService = new MarvelService();


	onCharLoading = () => {
		this.setState({ loading: true, error: false, skeleton: false })
	}

	onCharLoaded = (char) => {
		this.setState({ char, loading: false })
	}

	onError = () => {
		this.setState({ loading: false, error: true, skeleton: false })
	}

	updateChar = () => {
		if (!this.props.charId) return;

		this.onCharLoading();
		this.marvelService
			.getCharacter(this.props.charId)
			.then(this.onCharLoaded)
			.catch(this.onError)
	}

	componentDidMount() {
		this.updateChar()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.charId === this.props.charId) return;
		this.updateChar()
	}

	render() {
		const { char, loading, error, skeleton } = this.state;

		const errorComponent = error ? <Error /> : null;
		const loadingComponent = loading ? <Spinner /> : null;
		const skeletonComponent = skeleton ? <Skeleton /> : null;
		const content = !(error || loading || skeleton) ? <View {...char} /> : null;

		return (
			<div className="char__info" >
				{errorComponent}
				{loadingComponent}
				{skeletonComponent}
				{content}

			</div>
		)
	}
}

const View = ({ name, description, thumbnail, homepage, wiki, comics }) => {
	const comicsList = comics.map((comic, index) => {
		return (
			<li className="char__comics-item" key={index}>
				{comic.name}
			</li>
		)
	})

	const objectFit = thumbnail.indexOf('image_not_available') >= 0 ? 'contain' : 'cover';

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt="abyss" style={{ objectFit }} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">
				{description}
			</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length !== 0 ? comicsList : "There are no comics"}
			</ul></>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo;