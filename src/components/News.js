import React, {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from 'react-infinite-scroll-component';


const News = (props)=> {
  const [articles, setArticles]=useState([]);
  const [loading, setLoading]=useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const updateNews = async ()=> {
    props.setProgress(5);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(loading);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }
  
  useEffect(() => {
    document.title = `${props.category}-News Monkey`;
    updateNews();
    //eslink-disable-next-line
  }, [])
  
    
  const fetchMoreData = async ()=>{
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
      setPage(page + 1);
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setLoading(false);
    } ;

  // handlePreviouspage = async () => {
  //   let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${this.state.page-1}&pageSize=${props.pageSize}`;
  //    let data = await fetch(url);
  //    let parsedData = await data.json();
  //    console.log("pervious");
  //   this.setState({
  //     page : this.state.page - 1,
  //     articles : parsedData.articles,
  //     loading:false
  //   })
  //   this.setState({ page: this.state.page - 1 });
  //   setPage(page - 1);
  //   updateNews();
  // };

  // handleNextpage = async () => {
  //   if(!(this.state.page+1 > Math.ceil(this.state.totalResults/props.pageSize))){
  //     let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${this.state.page + 1}&pageSize=${props.pageSize}`;
  //     this.setState({loading:true});
  //     let data = await fetch(url);
  //     let parsedData = await data.json();
  //     console.log("next");
  //     this.setState({
  //       page : this.state.page + 1,
  //       articles : parsedData.articles,
  //       loading : false
  //     })
  //   }
  //   this.setState({ page: this.state.page + 1 });
  //   setPage(page + 1);  
  //   updateNews();
  // };


    return (
      <div className="container my-3">
        <h2 className="text-center" style={{ margin: "70px 0px" }}>
          NewsMonkey-Top Headlines on {props.category}
        </h2>
        {/* {this.state.loading && <Spinner/>} */}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loading={<Spinner/>}
        >
          <div className="container">
          <div className="row justify-content-evenly">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </InfiniteScroll>
        {/* <div className="btn d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePreviouspage}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextpage}
          >
            Next &rarr;
          </button>
        </div> */}
      </div>
    );
}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News
