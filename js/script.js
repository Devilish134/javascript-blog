'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){

  const titleList = document.querySelector(optTitleListSelector);

  document.querySelector(optTitleListSelector).innerHTML ='';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span></span>' + articleTitle + '</a></li>';
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagsParams(tags){

  const params = {
    max: 0,
    min: 9999999,
  };

  for(let tag in tags){
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  const cloudClassPrefixHTML = optCloudClassPrefix + classNumber;

  return cloudClassPrefixHTML;
}

function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTML = '<a href="#tag-' + tag + '"><span>' + tag + '</span></a>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array*/
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';

  for(let tag in allTags){
    /*[NEW] generate code of a link and add allTagsHTML*/
    const linkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '"><span>' + tag + ' (' + allTags[tag] + ') ' + '</span></a></li>';
    allTagsHTML = allTagsHTML + linkHTML;
  }
  tagList.innerHTML = allTagsHTML;
}

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tagActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  for(let tagActiveLink of tagActiveLinks ){
    tagActiveLink.classList.remove('active');
  }
  
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagsEqualToClicked = document.querySelectorAll('a[href^="'+ href + '"]');
  
  for(let tagEqualTo of tagsEqualToClicked){ 
    tagEqualTo.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}
  
function addClickListenersToTags(){

  const tagActiveLinks = document.querySelectorAll('a[href^="#tag-"]');
  console.log(tagActiveLinks);

  for(let tagActiveLink of tagActiveLinks){
    tagActiveLink.addEventListener('click', tagClickHandler);
  }
}

function generateAuthors(){

  const authors = document.querySelectorAll(optArticleSelector);

  for(let author of authors){
    const authorWrapper = author.querySelector(optArticleAuthorSelector);
    let html = '';

    const authorNames = author.getAttribute('data-author');
    const authorNamesArray = [];
    authorNamesArray.push(authorNames);

    for(let authorName of authorNamesArray){
      const linkHTML = '<a href="#author-' + authorName + '" ><span>' + authorName + '</span></a>';
      html = html + linkHTML;
    }
    authorWrapper.innerHTML = html;
  }
}

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');
  const authorName = href.slice(8);

  const authorActiveLinks = document.querySelectorAll(optArticleAuthorSelector);

  for(let authorActiveLink of authorActiveLinks){
    authorActiveLink.classList.remove('active');
  }

  const authorsEqualToClicked = document.querySelectorAll('a[href^="'+ href + '"]');

  for(let authorEqualToClicked of authorsEqualToClicked){
    authorEqualToClicked.classList.add('active');
  }
  generateTitleLinks('[data-author="' + authorName + '"]');
}

function addClickListenersToAuthors(){

  const linkToAuthors = document.querySelectorAll('a[href^="#author-"]');
  
  for(let linktoAuthor of linkToAuthors){
    linktoAuthor.addEventListener('click', authorClickHandler);
  }
}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
