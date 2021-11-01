// THIS SIMULATES WHAT A DATABASE OR API WOULD DO TO LOAD CONTENT INTO YOUR PAGE
data.map((item) => {
	wrapping = document.createElement('div');
	wrapping.classList.add('listing__col');
	wrapping.setAttribute('data-value', item.title)
	wrapping.innerHTML = `
		<div class="listing__card">
			<div class="listing__card__img-container">
				<img src="${item.img}" alt="Image: ${item.title}" title="Image: ${item.title}" class="listing__card__img">
			</div>

			<div class="listing__card__text">
				<h2 class="listing__card__text__title">${item.title}</h2>
				<p class="listing__card__text__text">${item.text}</p>
				<a href="${item.linkHref}" class="listing__card__text__link">See More</a>
			</div>
		</div>
	`;

	document.querySelector('.listing').appendChild(wrapping);
})

// ACTUAL SEARCH BLOCK
let searchForm = document.querySelector('#searchForm'),
searchInp = document.querySelector('#searchInput'),
searchBtn = document.querySelector('#searchButton');

let list = document.querySelector('.listing');
let elementsList = [];

//ALL OF THE MAGIC WILL BE HAPPENING ON THE CLIENT SIDE, NO NEED TO SUBMIT THE FORM, YOU CAN JUST NOT USE THE FORM AT ALL, BUT I PREFFERED TO DO SO BECAUSE IT'S BETTER FOR ACCESSIBILYTY
searchForm.addEventListener('submit', function(e){
	e.preventDefault();
})

//TRANSFORMING THE HTML LIST INTO AN ARRAY JUST TO BE ABLE TO USE .MAP MULTIPLE TIMES
let elements = document.getElementsByClassName('listing__col');
for(i=0; i<elements.length; i++){
	elementsList.push(elements[i])
}

//THIS FUNCTION IS USED TO CLEAN THE STRING FROM ACCENT MARKS AND CONVERT TO LOWERCASE
function cleanEntry(str) {
	dirty = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ';
	clean = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr';

	newStr='';

	for(i=0; i<str.length; i++) {
		replace=false;
		for (a=0; a<dirty.length; a++) {
			if (str.substr(i,1)==clean.substr(a,1)) {
				newStr+=clean.substr(a,1);
				replace=true;
				break;
			}
		}
		if (replace==false) {
			newStr+=str.substr(i,1);
		}
	}
	return newStr.toLowerCase();
}

// LOOKING FOR DYNAMIC CONTENT THAT WE CAN USE TO SEARCH FOR, HERE YOU'LL SET UP ANY TAG THAT YOU WANT TO BE SEARCHABLE
elementsList.map(function(el){
	let searchFor = el.querySelector('.listing__card__text__title').innerText;
	el.setAttribute('data-value', cleanEntry(searchFor));
})

// ACTUAL SEARCH FUNCTION
function search(pattern, text) {
	if (pattern.length == 0)
	return 0; // Immediate match

	var lsp = [0]; // Base case
	for (var i = 1; i < pattern.length; i++) {
		var j = lsp[i - 1]; // Start by assuming we're extending the previous LSP
		while (j > 0 && pattern.charAt(i) != pattern.charAt(j))
		j = lsp[j - 1];
		if (pattern.charAt(i) == pattern.charAt(j))
		j++;
		lsp.push(j);
	}

	var j = 0; // Number of chars matched in pattern
	for (var i = 0; i < text.length; i++) {
		while (j > 0 && text.charAt(i) != pattern.charAt(j))
		j = lsp[j - 1]; // Fall back in the pattern
		if (text.charAt(i) == pattern.charAt(j)) {
			j++; // Next char matched, increment position
			if (j == pattern.length)
			return i - (j - 1);
		}
	}
	return -1; // Not found
}

// AT EVERY LETTER TYPED INTO THE INPUT IT SEARCHS FOR ELEMENTS THAT MATCHS THE SEARCH
searchInp.addEventListener('keyup', function(e){
	searchVal = searchInp.value.toLowerCase();
	list.style.opacity = '0';
	
	if(searchVal !== ''){
		elementsList.map(function(el){
			let searchFor = el.getAttribute('data-value');
			result = search(searchVal, searchFor)
			if(result  !== -1){
				el.style.display = 'block';
			}else{
				el.style.display = 'none';
			}
		})
		list.style.opacity = '1';
	}else{
		elementsList.map(function(el){
			el.style.display = 'block';
		})
		
		list.style.opacity = '1';
	}
}); 