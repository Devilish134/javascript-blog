'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optArticleAuthorSelector = '.post-author',
  optAuthorListSelector = '.authors.list',
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
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
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

  for(let article of articles){
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTMLData = { id: tag, title: tag };
      const linkHTML = templates.articleTagLink(linkHTMLData);
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
  const allTagsData = {tags: []};

  for(let tag in allTags){
    /*[NEW] generate code of a link and add allTagsHTML*/
    allTagsData.tags.push({
      tag: tag,
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  console.log('Tags', tagList);
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
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
  
  for(let tagEqualToClicked of tagsEqualToClicked){ 
    tagEqualToClicked.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}
  
function addClickListenersToTags(){

  const tagActiveLinks = document.querySelectorAll('a[href^="#tag-"]');

  for(let tagActiveLink of tagActiveLinks){
    tagActiveLink.addEventListener('click', tagClickHandler);
  }
}

function generateAuthors(){

  let allAuthors = {};

  const authors = document.querySelectorAll(optArticleSelector);

  for(let author of authors){
    const authorWrapper = author.querySelector(optArticleAuthorSelector);
    let html = '';

    const authorNames = author.getAttribute('data-author');
    const authorNamesArray = [];
    authorNamesArray.push(authorNames);

    for(let authorName of authorNamesArray){
      const linkHTMLData = { author: authorName };
      const linkHTML = templates.articleAuthorLink(linkHTMLData);
      html = linkHTML;

      if(!allAuthors.hasOwnProperty(authorName)){
        allAuthors[authorName] = 1;
      } else {
        allAuthors[authorName]++;
      }
    }
    authorWrapper.innerHTML = html;
  }

  const authorList = document.querySelector(optAuthorListSelector);
  const allAuthorsData = {author: []};

  for(let authorName in allAuthors){
    allAuthorsData.author.push({
      author: authorName,
      count: allAuthors.authorName,
    });
  }
  console.log('Authors', authorList.innerHTML);
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
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