import { useEffect } from "react";
import { Link, Route, useParams, useRouteMatch } from "react-router-dom";
import { Fragment } from "react/cjs/react.production.min";
import Comments from "../components/comments/Comments";
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import NoQuotesFound from "../components/quotes/NoQuotesFound";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { getSingleQuote } from "../lib/api";

const QuoteDetail = () => {
  const params = useParams();
  const match = useRouteMatch();
  const { quoteId } = params;
  const {
    sendRequest,
    status,
    data: loadedQuote,
    error,
  } = useHttp(getSingleQuote);
  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="centered focused">{error}</p>;
  }

  if (status === "completed" && (loadedQuote || loadedQuote.length === 0)) {
    return <NoQuotesFound />;
  }

  if(!loadedQuote){
    return <p>No Quote Found</p>
  }
  // const quote = loadedQuote.find((quote) => quote.id === params.quoteId);

  return (
    <Fragment>
      <HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />
      <Route path={`${match.path}`} exact>
        <div className="centered">
          <Link className="btn--flat" to={`${match.url}/comments`}>
            Load Comments
          </Link>
        </div>
      </Route>

      <Route path={`${match.path}/comments`}>
        <Comments />
      </Route>
    </Fragment>
  );
};

export default QuoteDetail;
