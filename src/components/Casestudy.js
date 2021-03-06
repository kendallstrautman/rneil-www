import React, { lazy } from "react";
import Prismic from "prismic-javascript";
import Nav from "./Nav";
import Header_Slice from "./Slices/Header_Slice";
import Casestudy_Slice from "./Casestudy_Slice";
import Location_Info_Slice from "./Slices/Location_Info_Slice";
import Title_Slice from "./Slices/Title_Slice";
const Next_Btn = lazy(() => import("./Next_Btn"));

class Casestudy extends React.Component {
  state = {
    doc: null,
    casestudyId: null,
    casestudyContent: [],
    isMobile: false,
    colorMode: null,
    nextCasestudyId: null,
    nextCasestudySlug: null,
    isNext: false,
    currentPath: null
  };
  //FUNCS---------------------------------------------
  getPrismicData = () => {
    Prismic.api(process.env.REACT_APP_BASE_URL, {
      accessToken: process.env.REACT_APP_ACCESS_TOKEN
    }).then(api => {
      api
        .query(Prismic.Predicates.at("document.id", `${this.props.id}`))
        .then(response => {
          if (response) {
            this.setState({
              doc: response.results,
              casestudyId: response.results[0].id,
              isNext: false,
              nextCasestudyId: null,
              nextCasestudySlug: null
            });
            // console.log(this.state.doc);
            this.cleanData();
            this.props.scrollTop();
          }
        })
        .catch(error => console.log(error));
    });
  };
  //run through all the casestudy data, assign the casestudy content as props
  cleanData = () => {
    let casestudyContent = [];
    if (this.state.doc) {
      this.state.doc[0].data.body.forEach(casestudySlice => {
        casestudyContent.push(casestudySlice);
      });
      this.state.doc[0].data.casestudy_title[0].text;
    }
    this.setState({
      casestudyContent,
      casestudyTitle: this.state.doc[0].data.casestudy_title[0].text,
      casestudyTitleCopy:
        this.state.doc[0].data.casestudy_supporting_title_copy[0] &&
        this.state.doc[0].data.casestudy_supporting_title_copy[0].text,
      casestudyLocation: this.state.doc[0].data.casestudy_location[0]
        ? this.state.doc[0].data.casestudy_location[0].text
        : null,
      casestudyCity: this.state.doc[0].data.casestudy_city[0]
        ? this.state.doc[0].data.casestudy_city[0].text
        : null,
      casestudyYear: this.state.doc[0].data.casestudy_year[0]
        ? this.state.doc[0].data.casestudy_year[0].text
        : null,
      titleCopyColor: this.state.doc[0].data.title_copy_color,
      casestudyHero: this.state.doc[0].data.in_casestudy_hero_desktop.url
        ? this.state.doc[0].data.in_casestudy_hero_desktop.url
        : this.state.doc[0].data.casestudy_hero_image.url,
      casestudyHeroMobile: this.state.doc[0].data.in_casestudy_hero_mobile.url
        ? this.state.doc[0].data.in_casestudy_hero_mobile.url
        : this.state.doc[0].data.casestudy_hero_image_mobile.url,
      heroIsVideo: this.state.doc[0].data.image_or_video,
      autoplayHero: this.state.doc[0].data.autoplay_video_hero.url,
      autoplayHeroMobile: this.state.doc[0].data.autoplay_video_hero_mobile.url
    });
    if (this.state.doc[0].data.light_dark_mode.toLowerCase() == "dark") {
      this.setState({
        colorMode: this.state.doc[0].data.light_dark_mode,
        navClass: "--dark-mode"
      });
    } else {
      this.setState({
        colorMode: "light",
        navClass: "--light-mode"
      });
    }
  };
  renderCasestudyData = () => {
    // console.log(this.state.casestudyContent);
    if (this.state.casestudyContent) {
      let i = 0;
      return (
        <section className="casestudy-slices">
          {this.state.casestudyContent.map(casestudySlice => {
            i++;
            return (
              <Casestudy_Slice
                id={`${this.state.casestudyId}-${[i]}-${
                  casestudySlice.slice_type
                }`}
                slice_doc={casestudySlice}
                key={`${this.state.casestudyId}-${[i]}-${
                  casestudySlice.slice_type
                }`}
                slice_type={casestudySlice.slice_type}
                isMobile={this.state.isMobile}
                colorMode={this.state.colorMode}
                handleFadeIn={this.props.handleFadeIn}
                handleFadeOut={this.props.handleFadeOut}
              />
            );
          })}
        </section>
      );
    }
  };
  //pass down to the casestudy and slices to toggle mobile/desktop assets
  checkForMobile = () => {
    if (
      window.innerWidth < 1024 ||
      document.documentElement.clientWidth < 1024
    ) {
      this.setState({
        isMobile: true
      });
    } else {
      this.setState({
        isMobile: false
      });
    }
  };
  //check props for 'next' casestudy, pass down id and slug
  handleNextButton = () => {
    const { order } = this.props;
    let nextIndex = 0;
    //find out where we are in the order...
    if (this.props.order.length > 0) {
      let currentIndex = order.indexOf(
        order.find(current => {
          return current.slug == this.props.slug;
        })
      );
      /*
      if were at the last casestudy, route to beginning 
      otherwise, set next route 
      */
      if (currentIndex == this.props.order.length - 1) {
        nextIndex = order[0];
      } else {
        nextIndex = order[currentIndex + 1];
      }
      // if (nextIndex && this.state.nextCasestudyId === null)
      if (nextIndex && !this.state.isNext) {
        this.setState({
          nextCasestudyId: nextIndex.id,
          nextCasestudySlug: nextIndex.slug,
          isNext: true,
          currentPath: this.props.location.pathname
        });
      }
    }
  };
  checkColorMode = () => {
    if (
      this.state.colorMode &&
      this.state.colorMode.toLowerCase() === "light"
    ) {
      document.querySelector("body").classList.add("body--is-white");
    } else {
      document.querySelector("body").classList.remove("body--is-white");
    }
  };
  //LIFECYCLE------------------------------------------------
  componentDidMount() {
    this.getPrismicData();
    this.checkForMobile();
    //HACK to fix weird scroll bug between Router Links
    this.props.scrollTop();
    this.checkColorMode();
    window.addEventListener("resize", this.checkForMobile);
  }
  componentDidUpdate() {
    if (
      this.state.nextCasestudySlug &&
      !(this.state.currentPath == this.props.location.pathname)
    ) {
      this.getPrismicData();
    }
    this.handleNextButton();
    this.checkColorMode();
    window.addEventListener("resize", this.checkForMobile);
  }
  componentWillUnmount() {
    if (
      this.state.colorMode &&
      this.state.colorMode.toLowerCase() === "light"
    ) {
      document.querySelector("body").classList.remove("body--is-white");
    }
    window.removeEventListener("resize", this.checkForMobile);
  }
  //RENDER-------------------------------------------------
  render() {
    return (
      <main
        className={`casestudy ${
          this.state.colorMode && this.state.colorMode.toLowerCase() === "light"
            ? "casestudy--light"
            : "casestudy--dark"
        } --isLoaded`}
      >
        <Nav
          class={this.state.navClass}
          page={`casestudy ${
            this.state.colorMode &&
            this.state.colorMode.toLowerCase() === "dark"
              ? "casestudy--dark"
              : "casestudy--light"
          }`}
        />
        <Header_Slice
          id={this.state.casestudyId}
          titleCopy={this.state.casestudyTitleCopy}
          titleCopyColor={this.state.titleCopyColor}
          isVideo={this.state.heroIsVideo === "video" ? true : false}
          casestudyHero={
            this.state.casestudyHeroMobile && window.innerWidth < 768
              ? this.state.casestudyHeroMobile
              : this.state.casestudyHero
          }
          casestudyHeroVideo={
            this.state.autoplayHeroMobile && window.innerWidth < 768
              ? this.state.autoplayHeroMobile
              : this.state.autoplayHero
          }
          colorMode={this.state.colorMode}
          handleFadeIn={this.props.handleFadeIn}
          handleFadeOut={this.props.handleFadeOut}
        />
        <Location_Info_Slice
          location={this.state.casestudyLocation}
          city={this.state.casestudyCity}
          year={this.state.casestudyYear}
          id={this.state.casestudyId}
          handleFadeIn={this.props.handleFadeIn}
          handleFadeOut={this.props.handleFadeOut}
        />
        <Title_Slice
          title={this.state.casestudyTitle}
          id={this.state.casestudyId}
          handleFadeIn={this.props.handleFadeIn}
          handleFadeOut={this.props.handleFadeOut}
        />
        {this.renderCasestudyData()}
        <Next_Btn
          url={`/${this.state.nextCasestudySlug}/${this.state.nextCasestudyId}`}
          colorMode={
            this.state.colorMode &&
            this.state.colorMode.toLowerCase() === "dark"
              ? "#FFF"
              : "#000"
          }
        />
      </main>
    );
  }
}
export default Casestudy;
