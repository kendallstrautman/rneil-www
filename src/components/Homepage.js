import React from "react";
import Nav from "./Nav";
import Header from "./Header";
import Casestudy_Featured from "./Casestudy_Featured";
import Prismic from "prismic-javascript";
import { Link } from "@reach/router";

class Homepage extends React.Component {
  state = {
    doc: null,
    headerMainCopy: "how terrible and how beautiful",
    headerImageSlider: [],
    featuredCasestudies: [],
    casestudyNum: 0
  };

  /* 
  Could refactor this data call to only specifically get
  some info from the casestudies..... right now getting 
  all data... could get only the title, hero, and id
  */

  //Data Handling functions----------------------

  getPrismicData = () => {
    const { token, apiEndpoint } = this.props;
    Prismic.api(apiEndpoint, { accessToken: token }).then(api => {
      api
        .query(Prismic.Predicates.at("document.type", "home_page_header"), {
          fetch: [
            "home_page_header.home_page_header_title_copy",
            "home_page_header.home_page_header_slider_images"
          ]
        })
        .then(response => {
          if (response) {
            this.setState({
              doc: response.results
            });
            // console.log(this.state.doc);
            this.handleCleanData();
          }
        })
        .catch(error => console.log(error));
    });
  };

  handleCleanData = () => {
    if (this.state.doc) {
      this.state.doc.map(homepageItem => {
        if (homepageItem.type === "home_page_header") {
          let images = [];
          homepageItem.data.home_page_header_slider_images.map(image => {
            images.push(image.home_page_header_slider_image.url);
          });
          this.setState({
            headerImageSlider: images,
            headerMainCopy:
              homepageItem.data.home_page_header_title_copy[0].text
          });
        }
      });

      /*
      had to put this here to make the 'scroll' happen after the prismic
      content bc at first it was occurring but the anchor was already
      at the top of the page
      */
      this.handleExhibitionsLink();
    }
  };

  renderCasestudies = () => {
    console.log(this.props.casestudiesFeatured);
    if (this.props.casestudiesFeatured) {
      return (
        <div>
          {this.props.casestudiesFeatured.map(casestudy => {
            return (
              <Link
                to={`casestudy/${casestudy.slugs[0]}/${casestudy.id}`}
                key={casestudy.slugs[0]}
              >
                <Casestudy_Featured
                  title={casestudy.data.casestudy_title[0].text}
                  hero={casestudy.data.casestudy_hero_image.url}
                  heroMobile={casestudy.data.casestudy_hero_image_mobile.url}
                />
              </Link>
            );
          })}
        </div>
      );
    }
  };

  //The fancy animated 'scroll' down to that point
  handleAnchorLink = () => {
    console.log("anchor link!");
    document
      .getElementById("exhibitions")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  };

  handleExhibitionsLink = () => {
    if (/exhibitions$/.test(window.location)) {
      console.log("exhibitions!");
      this.handleAnchorLink();
    }
  };

  //LIFECYCLE----------------------------------

  componentDidMount() {
    this.getPrismicData();
  }

  // RENDER ---------------------------------------------

  render() {
    return (
      <div>
        <div className="homepage__body">
          <Nav logo="data:image/jpeg;base64,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" />
          <Header
            copy={this.state.headerMainCopy}
            galleryImages={this.state.headerImageSlider}
          />
          {this.renderCasestudies()}
        </div>
      </div>
    );
  }
}

export default Homepage;

//    <h1 onClick={this.handleAnchorLink}>TO ABOUT</h1>

/*

else if (homepageItem.type === "casestudy") {
          let casestudy = {};
          casestudy.title = homepageItem.data.casestudy_title[0].text;
          casestudy.hero = homepageItem.data.casestudy_hero_image.url;
          casestudy.heroMobile =
            homepageItem.data.casestudy_hero_image_mobile.url;
          casestudy.slug = homepageItem.slugs[0];
          casestudy.id = homepageItem.id;
          featuredCasestudies.push(casestudy);
        }
      });

      this.setState({
        featuredCasestudies
      });

 if (this.state.featuredCasestudies) {
      return (
        <div>
          {this.state.featuredCasestudies.map(casestudy => {
            return (
              <Link
                to={`casestudy/${casestudy.slug}/${casestudy.id}`}
                key={casestudy.slug}
              >
                <Casestudy_Featured
                  title={casestudy.title}
                  hero={casestudy.hero}
                  heroMobile={casestudy.heroMobile}
                />
              </Link>
            );
          })}
        </div>
      );
    }

  getPrismicData = () => {
    const { token, apiEndpoint } = this.props;
    Prismic.api(apiEndpoint, { accessToken: token }).then(api => {
      api
        .query(
          Prismic.Predicates.any("document.type", [
            "home_page_header",
            "casestudy"
          ])
        )
        .then(response => {
          if (response) {
            this.setState({
              doc: response.results
            });
            console.log(this.state.doc);
            this.handleCleanData();
          }
        })
        .catch(error => console.log(error));
    });
  };
  */
