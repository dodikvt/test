import * as React from "react";
import * as _ from "lodash";
import $ from 'jquery';
import jQuery from 'jquery';
// export for others scripts to use

import {
	SearchkitManager, SearchkitProvider,
	SearchBox, RefinementListFilter, MenuFilter,
	HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults,
	SideBar, ActionBar, ActionBarRow, InputFilter,
	RangeFilter, ViewSwitcherToggle, ViewSwitcherHits,
	PaginationSelect, TagCloud
} from "searchkit";

import { cloudinaryConfig, CloudinaryImage } from 'react-cloudinary';

cloudinaryConfig({ cloud_name: 'guicy' });

const host = window.location.protocol + "//" + window.location.hostname + ":9200/tracks"
const searchkit = new SearchkitManager(host)
const body = document.body;
// const evt = document.createEvent("CustomEvent")


const TrackHitsGridItem = (props) => {
  const {result, bemBlocks} = props
	const source:any = _.extend({}, result._source, result.highlight)

	const image = result._source.image.public_id || "guicy_not_found_vlenrd.jpg"
	var artist = "Unknown Artist"
	if(typeof result._source.artist != "undefined") {
		artist = result._source.artist.rawname
	}

	var handleClick = function(trackId) {

		var playTrack = new CustomEvent('playTrack', {bubbles: true, detail : { id : trackId}});

		body.dispatchEvent(playTrack);
	}

	if(typeof result._source != "undefined")
	return (
	  <div className="item col-xs-6 col-sm-4 col-md-3">
			<div>
				<CloudinaryImage publicId={image} className="cld-responsive" />
				<a onClick={() => handleClick(result._id)} className="item-thumb play-track">
					<div>
						<i className="fa fa-play-circle"></i>
					</div>
				</a>
				<a href={"/track/" + result._id + "/"} className="item-title">
					{result._source.title}<br/>
					{artist}
				</a>
			</div>
	  </div>
	)
}


const TrackHitsListItem = (props)=> {
  const {result, bemBlocks} = props
  const source:any = _.extend({}, result._source, result.highlight)

	const image = result._source.image.public_id || "guicy_not_found_vlenrd.jpg"
	var artist = "Unknown Artist"
	if(typeof source.artist != "undefined") {
		artist = source.artist.rawname;
	}

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) + " item col-xs-6 col-lg-4 list-group-item"} data-qa="hit">
			<div className="thumbnail">
				<a href={"/track/" + source.id + "/"} className="thumnail-link">
				<CloudinaryImage className={bemBlocks.item("image") + " group list-group-image cld-responsive"} publicId={image} />
				</a>
	      <div className={bemBlocks.item("details") + " caption"}>
	        <h4 className={bemBlocks.item("title")}>{source.title}</h4>
	        <p className={bemBlocks.item("subtitle")}>{artist}</p>
					<div className="hidden-xs">Cray lumbersexual hella cold-pressed, chambray quinoa normcore photo booth jean
						shorts actually before they sold out biodiesel pork Ethical deep v 90s,
						helvetica leggings selvage blue bottle skateboard pinterest actually stumptown</div>
					<div><span>Genre: </span>{result._source.genre}</div>
					<div><span>Keywords: </span>Sexy, Night Out, Rave</div>
					<div><span>Released: </span>1989</div>
	      </div>
			</div>
    </div>
  )
}


export class SearchPage extends React.Component {

	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout className="">
						<LayoutBody className="">
							<div className="col-md-3">
				        <SideBar>
									<SearchBox
										className=""
					          autofocus={true}
					          searchOnChange={true}
										placeholder="Search tracks..."
					          prefixQueryFields={["tracks^1", "title^10", "artist.name", "album.rawtitle","genre"]}/>
										<MenuFilter
											id="genre"
											title="Genres"
											field="genre"
											listComponent={TagCloud}/>
										<RangeFilter field="releasedYear" id="released" min={1970} max={2020} showHistogram={true} title="Release Date"/>
										<MenuFilter
											id="artist"
											title="Artists"
											field="artist.rawname"
											listComponent={ItemHistogramList}/>
				        </SideBar>
							</div>
							<div className="col-md-9 row list-group">
				        <LayoutResults>
				          <ActionBar>
				            <ActionBarRow>
				              <HitsStats/>
											<SortingSelector options={[
												{label:"Relevance", field:"_score", order:"desc", defaultOption:true},
												{label:"Latest Published", field:"publishedAt", order:"desc"},
												{label:"Earliest Published", field:"publishedAt", order:"asc"}
											]}/>
				            </ActionBarRow>
				            <ActionBarRow>
				              <SelectedFilters/>
				              <ResetFilters/>
											<ViewSwitcherToggle/>
				            </ActionBarRow>
				          </ActionBar>
										<ViewSwitcherHits
							          hitsPerPage={16}
							          sourceFilter={["title", "image", "artist", "composer", "album", "genre"]}
							          hitComponents = {[
													{key:"list", title:"", itemComponent:TrackHitsListItem},
													{key:"grid", title:"", itemComponent:TrackHitsGridItem, defaultOption:true},
							          ]}
							          scrollTo="body"
												className="row tracks-list-grid"
							      />
					          <NoHits/>
										<div className="row">
											<div className="col-md-12">
												<Pagination showNumbers={true} showText={false} pageScope={1}/>
											</div>
										</div>

				        </LayoutResults>
							</div>
			      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
