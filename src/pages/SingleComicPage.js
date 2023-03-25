import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Error from '../components/error/error';
import Spinner from '../components/spinner/spinner';
import useMarvelService from '../services/MarvelService';
import './singleComicPage.scss';


const SingleComicPage = () => {
	const { comicId } = useParams();
	const { loading, error, getComic } = useMarvelService();
	const [comic, setComic] = useState(null);
	const navigate = useNavigate()
	const back = () => navigate(-1)

	const updateComic = () => {
		getComic(comicId)
			.then(setComic)
	}

	useEffect(() => {
		updateComic()
	}, [])

	return (
		<>
			{loading ? <Spinner /> : null}
			{error ? <Error /> : null}
			{!(loading || error) ? <View {...comic} back={back}/> : null}
		</>
	)
}

const View = ({ title, description, price, thumbnail, language, pages ,back}) => {
	return (
		<div className="single-comic">
			<img src={thumbnail} alt="x-men" className="single-comic__img" />
			<div className="single-comic__info">
				<h2 className="single-comic__name">{title}</h2>
				<p className="single-comic__descr">{description}</p>
				<p className="single-comic__descr">{pages} pages</p>
				<p className="single-comic__descr">Language: {language}</p>
				<div className="single-comic__price">{price}</div>
			</div>
			<Link onClick={back} className="single-comic__back">Go back</Link>
		</div>
	)
}

export default SingleComicPage;