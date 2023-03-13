import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { useEffect, useState } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import Error from '../error/error';

const RandomChar = () => {
	const [char, setChar] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const marvelService = new MarvelService();

	const onCharLoading = () => {
		setLoading(true);
		setError(false);
	}

	const onCharLoaded = (char) => {
		setChar(char);
		setLoading(false);
	}

	const onError = () => {
		setLoading(false);
		setError(true);
	}

	const updateChar = () => {
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)

		onCharLoading();
		marvelService
			.getCharacter(id)
			.then(onCharLoaded)
			.catch(onError)
	}
	useEffect(() => {
		updateChar()
	}, [])

	const loadingComponent = loading ? <Spinner /> : null;
	const errorComponent = error ? <Error /> : null;
	const charInfo = !(loadingComponent || errorComponent) ? <View {...char} /> : null;

	return (
		<div className="randomchar">
			{loadingComponent}
			{errorComponent}
			{charInfo}
			<div className="randomchar__static">
				<p className="randomchar__title">
					Random character for today!<br />
					Do you want to get to know him better?
				</p>
				<p className="randomchar__title">
					Or choose another one
				</p>
				<button className="button button__main"
					onClick={updateChar}>
					<div className="inner">try it</div>
				</button>
				<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
			</div>
		</div>
	)
}

const View = ({ name, description, thumbnail, homepage, wiki, }) => {
	const objectFit = thumbnail.indexOf('image_not_available') >= 0 ? 'contain' : 'cover';

	return (
		<div className="randomchar__block">
			<img src={thumbnail} alt="Random character" className="randomchar__img" style={{ objectFit }} />
			<div className="randomchar__info">
				<p className="randomchar__name">{name}</p>
				<p className="randomchar__descr">
					{description}
				</p>
				<div className="randomchar__btns">
					<a href={homepage} className="button button__main">
						<div className="inner">homepage</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">Wiki</div>
					</a>
				</div>
			</div>
		</div>
	)
}

export default RandomChar;