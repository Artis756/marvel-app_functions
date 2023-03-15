import './charInfo.scss';

import { useEffect, useState } from 'react';
import Spinner from '../spinner/spinner';
import Error from '../error/error';
import Skeleton from '../skeleton/Skeleton';

import PropTypes from 'prop-types'

import useMarvelService from '../../services/MarvelService';

const CharInfo = ({ charId }) => {
	const [char, setChar] = useState(null);
	const [skeleton, setSkeleton] = useState(true);

	const { error, loading, getCharacter } = useMarvelService();

	const onCharLoading = () => {
		setSkeleton(false);
	}

	const onCharLoaded = (char) => {
		setChar(char);
	}

	const onError = () => {
		setSkeleton(false);
	}

	const updateChar = () => {
		if (!charId) return;

		onCharLoading();
		getCharacter(charId)
			.then(onCharLoaded)
			.catch(onError)
	}

	useEffect(() => {
		updateChar();
	}, [charId])

	const errorComponent = error ? <Error /> : null;
	const loadingComponent = loading && !skeleton ? <Spinner /> : null;
	const skeletonComponent = skeleton ? <Skeleton /> : null;
	const content = !(error || loading || skeleton || !char) ? <View {...char} /> : null;

	return (
		<div className="char__info" >
			{errorComponent}
			{loadingComponent}
			{skeletonComponent}
			{content}

		</div>
	)
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