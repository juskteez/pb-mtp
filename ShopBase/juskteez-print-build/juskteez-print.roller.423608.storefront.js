//console.log('Personal Scripts Loaded');

function createEle(eleTag, eleSelector, eleContent, stringify, eleStacker) {
    if (eleTag && eleTag !== '') {
        var newEle = document.createElement(eleTag);

        if (eleContent && eleContent !== '') newEle.innerHTML = eleContent;
        if (eleSelector && eleSelector !== '') newEle.setAttribute('class', eleSelector);
        if (eleStacker) newEle.setAttribute('data-string', eleContent);

        return (stringify ? newEle.outerHTML : newEle);
    }
}

function stackEle(eleSelector) {
    var allEle = document.querySelectorAll(eleSelector);
    if (allEle.length > 0) {
        for (var i = 0; i < allEle.length; i++) {
            var thisCTitle = allEle[i];

            if (!thisCTitle.classList.contains('jacked')) {
                var cTitle      = thisCTitle.innerHTML.trim(),
                    stackTitle  = createEle('SPAN', '', cTitle, true, true),
                    jackedTitle = document.createElement('H3');

                jackedTitle.classList.add('collection-jacked_name');
                jackedTitle.innerHTML = stackTitle + stackTitle + stackTitle;

                thisCTitle.parentNode.appendChild(jackedTitle);
                thisCTitle.classList.add('jacked');

            }

        }
    }
}

function reHolder(selectors,placeHolder) {
    var selectorInputs = document.querySelectorAll(selectors);

    if (selectorInputs.length > 0) {
        for (var i = 0;i<selectorInputs.length;i++) {
            var thisInput = selectorInputs[i];
            if (placeHolder !== '') thisInput.setAttribute('placeholder',placeHolder);
            thisInput.setAttribute('required','required');
        }
    }
}

function watchCart() {
    var cart     = document.querySelector('.header .cart-drawer-content'),
        cartIcon = document.querySelector('.header a.cart-icon-bag');

    cart.addEventListener('mouseover',function() {
        cartIcon.classList.add('hover');
    });

    cart.addEventListener('mouseleave',function() {
        cartIcon.classList.remove('hover');
    });
}

// String.prototype.replaceAt = function(index, replacement) {
//     return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
// }

function childPos(ele){
    var  i= 0;
    while((ele=ele.previousSibling)!=null) ++i;
    return i;
}

function childPosUp(ele){
    var  i= 0;
    while((ele=ele.nextSibling)!=null) ++i;
    return i;
}

function watchOptions() {
    var allOptions       = document.querySelectorAll('.product__option'),
        variantContainer = document.getElementById('product-variants');

    /*for (var i = 0;i<allOptions.length;i++) {
        allOptions[i].addEventListener('click', function(e) {
            var thisOption = this,
                thisPos    = childPos(thisOption),
                thisParent = thisOption.parentNode.parentNode,
                prevSibPos = childPos(thisParent),
                nextSibPos = childPosUp(thisParent);

            thisParent.setAttribute('sib-pos',thisPos);

            if (prevSibPos > 0) {
                var sibAPos = thisParent.previousSibling.getAttribute('sib-pos');
                if (sibAPos === thisPos.toString()) {
                    thisParent.previousSibling.classList.add('sbl-b');
                    thisParent.classList.add('sbl-a');
                } else {
                    thisParent.previousSibling.classList.remove('sbl-b');
                    thisParent.classList.remove('sbl-a');
                }
            }
            if (nextSibPos > 0) {
                var sibBPos = thisParent.nextSibling.getAttribute('sib-pos');
                if (sibBPos === thisPos.toString()) {
                    thisParent.nextSibling.classList.add('sbl-a');
                    thisParent.classList.add('sbl-b');
                } else {
                    thisParent.nextSibling.classList.remove('sbl-a');
                    thisParent.classList.remove('sbl-b');
                }
            }
            //console.log('Clicked option: ' + childPos(thisOption.parentNode.parentNode) + '_' + childPos(thisOption));
        });
    }*/
}

//function

const mutationNode = document.getElementsByTagName('TITLE')[0];

const mutationConfig = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            //console.log('A child node has been added or removed.');
            init(true);
        }
        else if (mutation.type === 'attributes') {
            //console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

var productContainter,
    productDetail;

function init(reInit) {

    stackEle('.collection-name');
    reHolder('.section.subscribe input[name="email"]','w@nna be the first to get our latest release');
    watchOptions();

    if (!reInit) {
        watchCart();
        reHolder('.search-bar input[name="q"]','');
    }

    productContainter = document.querySelector('.product-page__container > .row.product__main-content');

    if (productContainter) {
        productDetail = productContainter.querySelector('.product__details');
    }

    //console.log('Personal Scripts Applied');

}

// Begin detect page changes
observer.observe(mutationNode, mutationConfig);

window.onload = function() {
    //console.log('Personal Page Loaded');

    init();

    document.addEventListener('scroll', function(e) {

        if (productContainter && productDetail) {

            var scrollProceed = (productDetail.offsetHeight + productContainter.offsetTop + window.scrollY),
                scrollLimited = productContainter.offsetTop + productContainter.offsetHeight;

            if (scrollProceed >= scrollLimited) {
                productDetail.classList.add('leave-detail');
            } else {
                productDetail.classList.remove('leave-detail');
            }
        }
    });

}