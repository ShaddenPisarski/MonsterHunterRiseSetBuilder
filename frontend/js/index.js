window.addEventListener('DOMContentLoaded', function initSite() {
    /**
     * Ajax request for all GET-Methods
     * @param {String} article
     * @param {Function} callback
     */
    function getAjaxRequest(article, callback) {
        const xmlHttpRequest = new XMLHttpRequest();
        let connectionString = 'http://localhost:3001/';

        if (article && article !== '') {
            connectionString += 'article?article=' + article;
        }

        xmlHttpRequest.addEventListener('load', function returnAjaxResult() {
            callback(JSON.parse(this.response));
        })
        xmlHttpRequest.open('GET', connectionString);
        xmlHttpRequest.send();
    }

    /**
     * Helper function to create article elements
     * @param {String} elementType
     * @param {String[]} classNames
     * @param {String} text
     * @returns {HTMLElement}
     */
    function createContainerElements(elementType, classNames, text) {
        let conainerElement = document.createElement(elementType);

        for (let className of classNames) {
            conainerElement.classList.add(className);
        }

        if(text) {
            conainerElement.innerText = text;
        }

        return conainerElement;
    }

    /**
     * Create the elements for the article preview
     * @param {Array} resultArray
     */
    function createPreviewElements(resultArray) {
        let mainContainer = document.getElementById('js-mainArticle');

        for (let article of resultArray) {
            // TODO Add background image to this element, given in article.image
            let previewContainer = createContainerElements('div', ['preview-container']);

            let linkContainer = createContainerElements('a', ['preview-title-link'], article.title);
            const linkText = article.title.replace(/\ /gmi, '_');
            linkContainer.href = '/article?article=' + linkText
            linkContainer.addEventListener('click', function (element) {
                element.preventDefault();

                // TODO Make function to create the detail page
                getAjaxRequest(linkText, console.log);
            });

            let titleContainer = createContainerElements('h2', ['preview-title']);

            let metaInfoContainer = createContainerElements('div', ['preview-meta-info']);
            let releaseYearContainer = createContainerElements('div', ['preview-release'], article.releaseYear);
            let platformContainer = createContainerElements('div', ['preview-platform'], article.platform);
            let categoriesContainer = createContainerElements('div', ['preview-categories'], article.categories);
            let ratingsContainer = createContainerElements('div', ['preview-rating'], article.rating);

            let teaserContainer = createContainerElements('div', ['preview-teaser']);
            let teaserContainerDE = createContainerElements('div', ['preview-teaser-de', 'hidden', 'de'], article.teaser.de);
            let teaserContainerEN = createContainerElements('div', ['preview-teaser-en', 'en'], article.teaser.en);

            titleContainer.appendChild(linkContainer);

            metaInfoContainer.appendChild(releaseYearContainer);
            metaInfoContainer.appendChild(platformContainer);
            metaInfoContainer.appendChild(categoriesContainer);
            metaInfoContainer.appendChild(ratingsContainer);

            teaserContainer.appendChild(teaserContainerEN);
            teaserContainer.appendChild(teaserContainerDE);

            previewContainer.appendChild(titleContainer);
            previewContainer.appendChild(metaInfoContainer);
            previewContainer.appendChild(teaserContainer);

            mainContainer.appendChild(previewContainer);
        }
    }

    /**
     * Toggle all content elements to be visible or not
     */
    function changeVisibleText() {
        const germanElements = document.getElementsByClassName('de');
        const englischelements = document.getElementsByClassName('en');

        for (let element of germanElements) {
            element.classList.toggle('hidden');
        }

        for (let element of englischelements) {
            element.classList.toggle('hidden');
        }
    }


    const currentDirectory = window.location.pathname;

    // We only want this happening when the site is on the index page
    if (currentDirectory === '/') {
        getAjaxRequest('', createPreviewElements);
    }

    const languageSelect = document.getElementById('js-languageSelect');
    languageSelect.addEventListener('change',  changeVisibleText)
});