
        const familleSelect = document.getElementById("famille");
        const genreSelect = document.getElementById("genre");
        const speciesSelect = document.getElementById("species");
        const nomSelect = document.getElementById("nom");

        const modal = document.getElementById('myModal');
        const modalHeader = document.getElementById('modalHeader');
        const modalText = document.getElementById('modalText');
        const modalImages = document.getElementById('modalImages');
        const gallery = document.getElementById("myGallery");
        const radio = document.getElementsByName("order");
        //const thumbnailGallery = document.getElementById('thumbnailGallery');

        let currentImageIndex = 0;

        //const thumbnails = ["image1.jpg", "image2.jpg", "image3.jpg"];

        var thumbnails;
        var which;
        var last_category = "famille";
        var last_value = "Poaceae";
        var currenturl;
        //var map2;

        function openModal(headerText, bodyText, imageArray) {
            // Clear previous images
            modalImages.innerHTML = '';
            modalText.innerHTML = '';
            
            modal.style.display = 'block';
            modalHeader.innerHTML = headerText.replace(" "," ");
            

            //var url = "https://raw.githubusercontent.com/frousseu/mosquitos/main/README.md";
            //fetch(url)
            //  .then(r=>r.blob()).then(b=>b.text()).then(m=>{document.getElementById("txt").innerHTML=marked.parse(m)});
            //var url = "https://raw.githubusercontent.com/frousseu/mosquitos/main/" + headerText.replace(" ","_");
            //var url = "https://raw.githubusercontent.com/frousseu/floreqc/main/Esp%C3%A8ces/Poaceae/Cinna/Cinna_arundinacea.md"
            var url3 = "https://raw.githubusercontent.com/flore-quebec/species/main/Esp%C3%A8ces/"+data[which].famille+"/"+data[which].genre+"/"+data[which].espèce.replace(" ","_")+".md";

            //fetch(url3)
            //  .then(r => r.blob())
            //  .then(b => b.text())
            //  .then(m => {modalText.innerHTML=marked.parse(m)});
              
            //modalText.style.fontFamily = 'Special Elite';
            //modalText.style.fontColor = '#555';
            //modalText.style.fontSize = '2.75vh';
            //modalText.style.textShadow = '1px 1px #eee';
            //modalText.innerHTML = marked.parse(md); 

            

            var url2 = "https://raw.githubusercontent.com/flore-quebec/species/main/Esp%C3%A8ces/"+data[which].famille+"/"+data[which].genre+"/"+data[which].espèce.replace(" ","_")+".md";

            //fetch(url)
            //  .then(r => r.blob())
            //  .then(b => b.text())
            //  .then(m => {modalText.innerHTML=marked.parse(m)});
              
            var md2 = `<p style="font-size: 1.5vh; text-align: right;">FL&#11206</p> <h3>Flore Laurentienne</h3>
            1. <b>Dactylis glomerata</b> L. — Dactyle pelotonné. — (_Orchard-grass_). — Plante cespiteuse
à souche fibreuse; chaume (long. 40-150 cm.); feuilles (larg. 2-6 mm.); panicule (long. 8-20
cm.) à branches solitaires, un peu scabres. Floraison estivale. Champs et lieux ombragés,
particulièrement dans les vergers. Général dans les lieux habités du Québec. Naturalisé de
l'Eurasie, où il est souvent cultivé. (Fig. 295). n = 14

Graminée de haute stature qui s'élève au-dessus des autres plantes et les écarte par sa vigueur. Les chaumes,
presque toujours un peu inclinés, sont terminés par une panicule unilatérale dont les pédicelles inférieurs sont écartés,
et les supérieurs resserrés, ce qui lui donne une apparence unique.`;
            //modalText.style.fontFamily = 'Special Elite';
            //modalText.style.fontColor = '#555';
            //modalText.style.fontSize = '2.75vh';
            //modalText.style.textShadow = '1px 1px #eee';
            //modalText.innerHTML = marked.parse(md);




            var fl = false;
            var url;
            var md;

            function changeText(flo) {
              if(flo) {
                url = "https://raw.githubusercontent.com/flore-quebec/species/main/Esp%C3%A8ces/"+data[which].famille+"/"+data[which].genre+"/"+data[which].espèce.replace(" ","_")+".md";
                
                fetch(url)
                  .then(r => r.blob())
                  .then(b => b.text())
                  .then(m => {modalText.innerHTML=marked.parse(m)});
                const ct = document.getElementById("textchange");
                ct.style.fontFamily = 'Special Elite';
                ct.innerHTML = '<span style="color: #999;">&#11207</span> <span style="color: black;">&#11208</span>';
                //modalText.appendChild(ct);
                modalText.style.fontFamily = 'League Spartan';
                modalText.style.fontColor = '#444';
                modalText.style.fontSize = '3vh';
                modalText.style.textShadow = '0px 0px #eee';
                
                fl = false;  
                console.log("***** true *******", fl);
              } else {
                md = `<h2>Flore laurentienne (1ère édition)</h2>
                1. <b>Dactylis glomerata</b> L. — Dactyle pelotonné. — (Orchard-grass). — Plante cespiteuse
    à souche fibreuse; chaume (long. 40-150 cm.); feuilles (larg. 2-6 mm.); panicule (long. 8-20
    cm.) à branches solitaires, un peu scabres. Floraison estivale. Champs et lieux ombragés,
    particulièrement dans les vergers. Général dans les lieux habités du Québec. Naturalisé de
    l'Eurasie, où il est souvent cultivé. (Fig. 295). n = 14 <br><br>Graminée de haute stature qui s'élève au-dessus des autres plantes et les écarte par sa vigueur. Les chaumes,
    presque toujours un peu inclinés, sont terminés par une panicule unilatérale dont les pédicelles inférieurs sont écartés,
    et les supérieurs resserrés, ce qui lui donne une apparence unique.`;
                const ct = document.getElementById("textchange");
                ct.style.fontFamily = 'League Spartan';
                ct.innerHTML = '<span style="color: black;">&#11207</span> <span style="color: #999;">&#11208</span>';
                modalText.style.fontFamily = 'Special Elite';
                modalText.style.fontColor = '#555';
                modalText.style.fontSize = '2.75vh';
                modalText.style.textShadow = '0px 0px #eee';
                modalText.innerHTML = marked.parse(md);
                //modalText.appendChild(ct);
                fl = true;
                console.log("***** false *******", fl);
              };
            }
            
            changeText(true);
            
            const tooc = document.getElementById("textchange");
            tooc.addEventListener('click', () => {
              changeText(fl);
            });
            
            //changeText(true);


            // Add images to modal
            // var isna; 
            imageArray.forEach(function (imageUrl, index) {
                const image = document.createElement('img');
                //const image = document.getElementById('modalImages');
                image.classList.add('modal-image');
                if(imageUrl === 'NA') {
                  image.src = 'https://cdn.hebergix.com/fr/floreqc/blank.jpg';
                } else {
                  image.src = imageUrl;//.replace("medium","medium");
                };
                //image.onerror="this.style.display='none'";
                //image.onerror="this.src='https://www.inaturalist.org/photos/355007378?size=small'";
                //isna = imageUrl;
                if(imageUrl != 'NA') {
                  image.onclick = function() {openGallery(imageUrl, index);};
                  //https://stackoverflow.com/questions/52723799/browser-goes-forward-two-steps-with-history-pushstate
                  //image.addEventListener('click', function(event) {
                  //  event.preventDefault();
                  //});
                };
                
                modalImages.appendChild(image);
                //<img class="thumbnail-image" src=${imageUrl} alt="Image 1" onclick="openGallery(${imageUrl}, 0)">
            });

            const taxonomy = document.getElementById('taxonomy');
            taxonomy.innerHTML=data[which].class+'&nbsp>&nbsp'+data[which].ordre+'&nbsp>&nbsp'+'<a class=taxonomylink href='+window.location.pathname+'?famille='+data[which].famille+'>'+data[which].famille+'</a>'+'&nbsp>&nbsp'+'<a class=taxonomylink href='+window.location.pathname+'?genre='+data[which].genre+'>'+data[which].genre+'</a>';
            const right = document.getElementById('links');


            //links.innerHTML='<a target="_blank" href='+data[which].vascan+'><img class="fna" src="https://cdn.hebergix.com/fr/floreqc/vascanlogo.jpg"></a><a target="_blank" href='+data[which].herbierqc+'><img class="fna" src="https://cdn.hebergix.com/fr/floreqc/herbier.png"></a><a target="_blank" href='+data[which].inat+'><img class="fna" src="https://static.inaturalist.org/sites/1-favicon.png?1573071870"></a><a target="_blank" href='+data[which].gbif+'><img class="fna" src="https://images.ctfassets.net/uo17ejk9rkwj/5NcJCYj87sT16tJJlmEuWZ/85058d511b3906fbbb199be27b2d1367/GBIF-2015-mark.svg"></a><a target="_blank" href='+data[which].fna+'><img class="fna" src="https://cdn.hebergix.com/fr/floreqc/fna.jpg"></a><a target="_blank" href='+data[which].powo+'><img class="fna" src="https://powo.science.kew.org/img/powo-favicon.ico"></a>';

            links.innerHTML=makeLink(data[which].vascan,"vascan")+makeLink(data[which].herbierqc,"herbierqc")+makeLink(data[which].inat,"inat")+makeLink(data[which].gbif,"gbif")+makeLink(data[which].fna,"fna")+makeLink(data[which].powo,"powo");

            const scien_complet = document.getElementById('scien_complet');
            const scien_alternatif = document.getElementById('scien_alternatif');
            const verna_fr = document.getElementById('verna_fr');
            const verna_alternatif_fr = document.getElementById('verna_alternatif_fr');
            const verna_en = document.getElementById('verna_en');
            const statut = document.getElementById('statut');
            const protection = document.getElementById('protection');
            const edit = document.getElementById('edit');
            const contrib = document.getElementById('contributor');
            //const map = document.getElementById('map');
            //const map = document.getElementById('map');

            scien_complet.innerHTML = italicizeBeforeSecondSpace(data[which].botanic);
            //scien_alternatif.innerHTML = data[which].alternatif;
            verna_fr.innerHTML = data[which].vernaculaire;
            //verna_alternatif_fr.innerHTML = data[which].vernacularFRalt;
            verna_en.innerHTML = data[which].vernacularEN;
            statut.innerHTML = data[which].status;
            protection.innerHTML = makeProtection();

            if(data[which].contribution === "NA"){ // just fill the column with "" in data
                contrib.innerHTML = ""; 
            } else {
                contrib.innerHTML = data[which].contribution+"&nbsp";
            };

            const edit_link = "https://github.com/flore-quebec/species/tree/main/Esp%C3%A8ces/"+data[which].famille+"/"+data[which].genre+"/"+data[which].espèce.replace(" ","_")+".md";
            edit.innerHTML = '<a class=\"edit\" href=\"' + edit_link + '\" target=\"_blank\">Éditez sur GitHub<img class="minioctocat" src="https://cdn.hebergix.com/fr/floreqc/github-mark.png"></a>';

            const map = document.getElementById('map');
            const pheno = document.getElementById('pheno');
            map.src = "https://cdn.hebergix.com/fr/floreqc/"+headerText.replace(" ","_")+"_map.png";
            pheno.src = "https://cdn.hebergix.com/fr/floreqc/"+headerText.replace(" ","_")+"_pheno.png";

        }


        function closeModal(back) {
            modalImages.innerHTML = '';
            modal.style.display = 'none';
            reset_map();
            if(back){
              //history.back();
              //console.log("**** back closeModal****", windows.location.href);
            };
        }

        // Function to close the gallery
        function closeGallery(forward) {
            const gallery = document.getElementById("myGallery");
            gallery.style.display = "none";
            //if(forward){
            //  history.forward();
            //};
        }

        window.onclick = function (event) {
        //    if (event.target === modal) {
        //        closeModal(true);
        //    };
            const gallery = document.getElementById("gallery-content");
            if (event.target === gallery) {
                closeGallery();
            };
        };


        function updateGallery(group, taxon) {

            const order = document.getElementsByName('order');

            //let selected;
            let selected;
            var filteredImages;
            let indexsp;
            let indexn;

            if (group === "famille") {
              //selected = taxon;//familleSelect.value;
              //last_value = familleSelect.value;
              filteredImages = data.filter(image => (
                (taxon === image.famille)
              ));
            } else if (group === "genre") {
              //selected = genreSelect.value;
              //last_value = genreSelect.value;
              filteredImages = data.filter(image => (
                (taxon === image.genre)
              ));
            } else if (group === "species") {
              //selected = speciesSelect.value;
              //last_value = genreSelect.value;
              filteredImages = data.filter(image => (
                (taxon === image.espèce)
              ));
            } else if (group === "nom") {
              //selected = nomSelect.value;
              //last_value = genreSelect.value;
              indexsp = nom_values.findIndex(p => p == taxon);
              indexn = common_names[indexsp][taxon.replaceAll(" ","_").replaceAll("-","_").replaceAll("'","_")];
              filteredImages = indexn.map(index => data[index]);
              //filteredImages = data[common_names[indexn]];    
            } else if (group === "latest") {
              //selected = speciesSelect.value;
              //last_value = genreSelect.value;
              filteredImages = find_latest(taxon);
            } else {
              //selected = speciesSelect.value;
              //last_value = speciesSelect.value;
              filteredImages = data.filter(image => (
                (taxon === image.espèce)
              ));
            };

            last_category = group;
            last_value = taxon;
            
            //if(push){
              //updateURL(last_category, last_value.replaceAll(" ", "_").replaceAll("'","_"));
            //}else{
              //const params = getURLparams();
              //const firstKey = Object.keys(params)[0];
              //const firstValue = params[firstKey];
              //var newURL = location.pathname+'?'+last_category+'='+last_value;
              //location.href = newURL;
            //};
            //addUrlparameter(last_category, last_value.replaceAll(" ", "_").replaceAll("'","_"));

            if(group === "famille" || group === "genre") {
              document.getElementById("selected").innerHTML = taxon;
            } else {
              document.getElementById("selected").innerHTML = "";
            }


            if( order[2].checked ){
               filteredImages = filteredImages.sort((a, b) => Number(b.nobs) - Number(a.nobs));
            } else if (order[1].checked) {
               filteredImages = filteredImages.sort((a, b) => Number(a.taxonomic_order) - Number(b.taxonomic_order));
            };



            // Clear the current gallery
            imageGallery.innerHTML = '';

            // Add filtered images to the gallery
            filteredImages.forEach(image => {
                const imageElement = document.createElement('div');
                imageElement.className = 'image-container';
                imageElement.id = image.alt;
                map = data.filter(index => (
                  (image.alt === index.species)
                ));
                var spnames;
                if(group === "nom"){
                  spname = image.vernaculaire;
                } else {
                  spname = image.alt;
                };
                
                if(image.src === "NA"){
                  image.src = 'https://cdn.hebergix.com/fr/floreqc/blank.jpg';
                };
                
                //const src = if(image.src === "NA"){"Pas de photo"}else{image.src};

                imageElement.innerHTML = `
                      <img class="image" src=${image.src} alt=${image.alt}>
                      <div class="image-title">
                        ${spname}<br>
                        <span class="image-credit">${image.credit[0].replace(', some rights reserved','').replace(', no rights reserved','')}</span>
                      </div>
                      <div class="image-map">
                        <img class="image-map-mini" src="https://cdn.hebergix.com/fr/floreqc/${image.alt.replace(" ","_")}_minimap.png"></img>
                      </div>
                `;
                imageGallery.appendChild(imageElement);
            });

            const imageContainers = document.querySelectorAll('.image-container');
            //


            imageContainers.forEach((container, index) => {
                container.addEventListener('click', () => {
                    //const title = container.querySelector('.image-title').textContent;
                    addModal(container.id, true);
                });
            });

        }
        
        function addModal(species, push) {
            const title = species;
            const text = '';
            const index = data.findIndex(p => p.espèce == title); // tests
            const images = data[index].images;
            thumbnails = images.filter(z => z != 'NA');
            which = index;
            updateFocusURL(title, text, images, push);
            //openModal(title, text, images);
        }


        // Function to open the gallery with a specific image
        function openGallery(imageSrc, index) {
            currenturl = window.location.href;
            const gallery = document.getElementById("myGallery");
            const galleryImage = document.getElementById("galleryImage");
            const captionText = document.getElementById("caption");
            const linkText = document.getElementById("link");
            //const linkText = document.getElementById(\"link\");

            galleryImage.src = imageSrc;
            gallery.style.display = "block";
            //galleryImage.src = imageSrc;
            galleryImage.src = imageSrc.replace("medium","original");
            currentImageIndex = index;
            captionText.innerHTML = data[which].credit[index];
            link = data[which].link[index];
            linkText.innerHTML = '<a class=\"link\" href=\"' + link + '\" target=\"_blank\">' + link + '</a>' ;
        }


        // Function to switch between images in the gallery
        function changeImage(offset) {
            currentImageIndex = (currentImageIndex + offset + thumbnails.length) % thumbnails.length;
            const galleryImage = document.getElementById("galleryImage");
            const captionText = document.getElementById("caption");
            const linkText = document.getElementById("link");
            galleryImage.src = thumbnails[currentImageIndex];
            galleryImage.src = thumbnails[currentImageIndex].replace("medium","original");
            captionText.innerHTML = data[which].credit[currentImageIndex];
            //linkText.innerHTML = data[which].link[currentImageIndex];
            link = data[which].link[currentImageIndex];
            linkText.innerHTML = '<a class=\"link\" href=\"'+link+'\" target=\"_blank\">'+link+'</a>' ;
        }


        //familleSelect.addEventListener("change", () => updateGallery("famille", false));
        //genreSelect.addEventListener("change", () => updateGallery("genre", false));
        //speciesSelect.addEventListener("change", () => updateGallery("species", false));
        //nomSelect.addEventListener("change", () => updateGallery("nom", false));
        
        familleSelect.addEventListener("change", () => updateGroupURL("famille", familleSelect.value));
        genreSelect.addEventListener("change", () => updateGroupURL("genre", genreSelect.value));
        speciesSelect.addEventListener("change", () => updateGroupURL("species", speciesSelect.value));
        nomSelect.addEventListener("change", () => updateGroupURL("nom", nomSelect.value));


        var filter = document.getElementById('filterList1');
        family_values.forEach(function(item){
           var option = document.createElement('option');
           option.value = item;
           filter.appendChild(option);
        });

        var filter = document.getElementById('filterList2');
        genus_values.forEach(function(item){
           var option = document.createElement('option');
           option.value = item;
           filter.appendChild(option);
        });

        var filter = document.getElementById('filterList3');
        species_values.forEach(function(item){
           var option = document.createElement('option');
           option.value = item;
           filter.appendChild(option);
        });

        var filter = document.getElementById('filterList4');
        nom_values.forEach(function(item){
           var option = document.createElement('option');
           option.value = item;
           filter.appendChild(option);
        });


        function changeOrder() {
            if(last_category !== "species") {
              updateGallery(last_category, last_value);
            };
        }


        function linkExists(link) {
          if(link === "" || link === "NA") {
            link;
          } else {
            "";
          };
        }


        function makeLink(link,name) {
          if(link===""){
            return "";
          };
          switch(name){
            case "vascan":
              return '<a target="_blank" href='+link+'><img class="fna" src="https://cdn.hebergix.com/fr/floreqc/vascanlogo.jpg"></a>';
            case "herbierqc":
              return '<a target="_blank" href='+link+'><img class="fna" src="https://cdn.hebergix.com/fr/floreqc/herbier.png"></a>';
            case "inat":
              return '<a target="_blank" href='+link+'><img class="fna" src="https://static.inaturalist.org/sites/1-favicon.png?1573071870"></a>';
            case "gbif":
              return '<a target="_blank" href='+link+'><img class="fna" src="https://images.ctfassets.net/uo17ejk9rkwj/5NcJCYj87sT16tJJlmEuWZ/85058d511b3906fbbb199be27b2d1367/GBIF-2015-mark.svg"></a>';
            case "fna":
              return '<a target="_blank" href='+link+'><img class="fna" src="https://cdn.hebergix.com/fr/floreqc/fna.jpg"></a>';
            case "powo":
              return '<a target="_blank" href='+link+'><img class="fna" src="https://powo.science.kew.org/img/powo-favicon.ico"></a>';
          };
        }


        function makeProtection() {
          var pro = data[which].LOIEMV + ", " + data[which].SARASTATUS + ", " + data[which].COSEWIC + ", " + data[which].GRANK+", " + data[which].NRANK + ", " + data[which].SRANK;
          pro = pro.replaceAll("NA, ","-").replace("NA","-");
          if(pro === ", , , , , "){
            return '';
          } else {
            return pro;
          }
        }


        function italicizeBeforeSecondSpace(inputString) {
          // Find the index of the second space
          const secondSpaceIndex = inputString.indexOf(' ', inputString.indexOf(' ') + 1);

          // Check if the second space exists
          if (secondSpaceIndex !== -1) {
            // Extract the substring before the second space and italicize it
            const italicizedPart = `<i>${inputString.substring(0, secondSpaceIndex)}</i>`;

            // Concatenate the italicized part with the rest of the string
            //const resultString = italicizedPart + inputString.substring(secondSpaceIndex);
            const resultString = inputString.substring(secondSpaceIndex);

            return resultString;
          }

          // Return the original string if there is no second space
          return inputString;
        }


        // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        let touchstartX = 0
        let touchendX = 0
        let touchstartY = 0
        let touchendY = 0

        function checkDirection() {
          if(isClicked === false){ // swipe pics only if not zoomed in
            const diffX = Math.abs(touchendX - touchstartX);
            const diffY = Math.abs(touchendY - touchstartY);
            if( diffX > diffY && diffX > 10){
              if (touchendX < touchstartX) changeImage(1)//alert('swiped left!')
              if (touchendX > touchstartX) changeImage(-1)//alert('swiped right!')
            }  
          }
        }

        document.addEventListener('touchstart', e => {
          touchstartX = e.changedTouches[0].screenX
          touchstartY = e.changedTouches[0].screenY
        })

        document.addEventListener('touchend', e => {
          touchendX = e.changedTouches[0].screenX
          touchendY = e.changedTouches[0].screenY
          checkDirection()
        })
        
          
        const image = document.getElementById('galleryImage');
        //const zoom = document.getElementById('zoom'); // testing

        let isClicked = false;
      
        image.addEventListener('click', function(event) {
          if (!isClicked) {
            image.classList.add('zoomed');
            //zoom.classList.add('zoomeddiv');
            isClicked = true;
            image.style.cursor = 'zoom-out';
            let x = event.offsetX;
            let y = event.offsetY;
            image.style.transformOrigin = `${x}px ${y}px`; /* Adjust transform origin based on mouse position */
          } else {
            image.classList.remove('zoomed');
            //zoom.classList.remove('zoomeddiv');
            isClicked = false;
            image.style.cursor = 'zoom-in';
          }
        });
      
        image.addEventListener('mousemove', function(event) {
          if (isClicked) {
            let x = event.offsetX;
            let y = event.offsetY;
            image.style.transformOrigin = `${x}px ${y}px`; /* Adjust transform origin based on mouse position */
          }
        });
        
        function zoom_reset() {
           const image = document.getElementById("galleryImage");
           //image.classList.remove('zoomed');
           image.classList.remove('zoomed');
           isClicked = false;
           image.style.cursor = 'zoom-in';
        } 
        
        image.addEventListener('mouseout', function(event) {
           zoom_reset();
        });
        

        // add the PMTiles plugin to the maplibregl global.
        const protocol = new pmtiles.Protocol();
        maplibregl.addProtocol('pmtiles', (request) => {
            return new Promise((resolve, reject) => {
                const callback = (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({data});
                    }
                };
                protocol.tile(request, callback);
            });
        });

      //let geo = fetch('https://cdn.hebergix.com/fr/floreqc/Ixobrychus_exilis.geojson')
      //           .then(r => r.json())
      //           .then(r => console.log("**********", r));
                 
      //const fetchPromise = fetch('https://cdn.hebergix.com/fr/floreqc/Ixobrychus_exilis.geojson');
      //    fetchPromise
      //      .then((response) => response.json())
      //      .then((data) => {
      //        console.log(data);
      //      });

      // we first fetch the header so we can get the center lon, lat of the map.
      
      //const test = fetch('https://flore-quebec.nyc3.cdn.digitaloceanspaces.com/Aquila_chrysaetos.pmtiles');
      //console.log("***** test ******", test);
    
      
      function species_occs(sp) {
  
          //const PMTILES_URL = 'https://object-arbutus.cloud.computecanada.ca/bq-io/acer/niches_climatiques/obs/' + sp + '.pmtiles';
          
          //https://flore.quebec.nyc3.cdn.digitaloceanspaces.com/Ixobrychus_exilis.pmtiles
          
          
          const PMTILES_URL = 'https://flore-quebec.nyc3.cdn.digitaloceanspaces.com/' + sp + '.pmtiles';
          //const PMTILES_URL = 'https://nyc3.digitaloceanspaces.com/flore.quebec/Aquila_chrysaetos.pmtiles';
          //const PMTILES_URL = 'https://flore.quebec.nyc3.cdn.digitaloceanspaces.com/Aquila_chrysaetos.pmtiles';
          const p = new pmtiles.PMTiles(PMTILES_URL);
          //console.log(p.getHeader());
  
          // this is so we share one instance across the JS code and the map renderer
          protocol.add(p);
  
          p.getHeader().then(h => {
              var map2 = new maplibregl.Map({
                  container: 'map2',
                  zoom: h.maxZoom -4,
                  //center: [h.centerLon, h.centerLat],
                  center: [-70, 53],
                  zoom: 2.75,
                  style: {
                      version:8,
                      sources: {
                          'example_source': {
                              type: 'vector',
                              url: `pmtiles://${PMTILES_URL}`,
                              attribution: '© <a target="_blank" href="https://openstreetmap.org">OpenStreetMap</a> contributors © <a target="_blank" href="https://openmaptiles.org/">OpenMapTiles</a>'
                          },
                          'raster-tiles': {
                          'type': 'raster',
                          'tiles': [
                              // NOTE: Layers from Stadia Maps do not require an API key for localhost development or most production
                              // web deployments. See https://docs.stadiamaps.com/authentication/ for details.
                              //'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.jpg'
                              //'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                              //'http://c.tile.opentopomap.org/{z}/{x}/{y}.png'
                              'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-geyser'
                              //'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                          ],
                          'tileSize': 256,
                          'attribution':
                              'GBIF Geyser par <a target="_blank" href="http://stamen.com">GBIF.org</a> | <a target="_blank" href="http://stamen.com">GBIF.org</a>  <a target="_blank" href="https://doi.org/10.15468/dl.3txsdx">https://doi.org/10.15468/dl.3txsdx</a>'
                      }
                      },
                      layers: [
                          {
                              'id': 'simple-tiles',
                              'type': 'raster',
                              'source': 'raster-tiles',
                              'minzoom': 0,
                              'maxzoom': 22
                          },
                          {
                              'id': 'observations',
                              'source': 'example_source',
                              'source-layer': sp,
                              'type': 'circle',
                              'paint': {
                                  'circle-color': 'forestgreen',
                                  'circle-radius': 3,
                                  'circle-opacity': 0.80,
                                  'circle-stroke-color': 'black',
                                  'circle-stroke-opacity': 0.85,
                                  'circle-stroke-width': 0.25,
                              }
                          }
                      ]
                  }
              });
              
              map2.addControl(new maplibregl.FullscreenControl());
              
              map2.on('load', () => {
                
                map2.setPaintProperty('observations', 'circle-radius', [
                  'interpolate', ['exponential', 1.45], ['zoom'],
                  5,4,
                  15,9
                ]);
                
                const myBounds = map2.getSource("example_source").bounds;
                //map2.setMaxBounds(myBounds);
                map2.fitBounds(myBounds, {maxZoom: 8, maxDuration: 0.01, padding: {top: 25, bottom:100, left: 50, right: 50}});
                
                const osmCycle = {
                    name: "OSM Cycle",
                    tiles: ['https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'],
                }
                const esriTerrain = {
                    name: "Esri Terrain",
                    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}'],
                    maxzoom: 13,
                    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
                }
                const baseLayers = {
                    osmCycle,
                    esriTerrain,
                }
                const basemapControl = new BasemapControl({ basemaps: baseLayers, initialBasemap: "osmCycle"  });
                //map2.addControl(basemapControl, 'top-right');
                });
              
              
          });
          

      }
        
      //const map = document.getElementById('map');
      map.addEventListener('click', function(event) {  
        const getsp = getURLparams().focus[0].replace(" ","_");
        species_occs(getsp);
        const staticmap = document.getElementById('map');
        staticmap.style.display = 'none';
        map2.style.display = 'block';
        //staticmap.style.visibility = 'hidden';
        //map2.style.visibility = 'visible';
      });
        
        
      //map2.on('fullscreenstart', function(event) {    
      //  const myBounds = map2.getSource("example_source").bounds;
      //          //map2.setMaxBounds(myBounds);
      //  map2.fitBounds(myBounds, {padding: {top: 25, bottom:50, left: 50, right: 50}});
      //});
      // Search params  
      //const queryString = window.location.search;
      //const urlParams = new URLSearchParams(queryString);
      
      //const product = urlParams.get('product')
      
      //function addUrlParameter(name, value) {
      //   var searchParams = new URLSearchParams(window.location.search)
      //   searchParams.set(name, value)
      //   window.location.search = searchParams.toString()
      //   //updateGallery("genre");
      //}
      
      // Function to update URL with selected option
      function updateGroupURL(param, value) {
          //var newURL = window.location.href.split('?')[0]; // Get the current URL without parameters
          var newURL = window.location.pathname; // Get the current URL without parameters
          newURL += '?' + param + '=' + value; // Add the new parameter with the selected option value
          //if (!history.state || history.state.page!=newURL){
          //if (history.state.page!=newURL){
          var states = {};
          //if(param !== 'focus'){
            states['group'] = param;
            states['taxon'] = value;
          //};
          //states[param] = value;
          history.pushState(states, '', newURL); // Update the URL without reloading the page
          console.log("**** push updateGroupURL ****",newURL);
          document.title = value;
          
          updateGallery(param, value);
            //history.pushState({ "page": newURL }, '', newURL); //https://stackoverflow.com/questions/30429172/html5-history-api-cannot-go-backwards-more-than-once
          //};
          //https://stackoverflow.com/questions/58039669/how-to-listen-for-changes-to-window-location-search-in-2019
          //history.forward();
          //history.back();
          //window.location.reload();
          //window.location.href = newURL;
          //var popStateEvent = new PopStateEvent('popstate', { param: value });
          //dispatchEvent(popStateEvent);
          //var urlParams = new URLSearchParams(window.location.search);
          
      }
      
      function updateFocusURL(value, text, images, push) {
          var newURL = window.location.pathname; // Get the current URL without parameters
          //var states = history.state;
          var states = {};
          //states['group'] = param;
          //states['taxon'] = value;
          states['focus'] = value;
          newURL += '?' + 'focus=' + value;//state2querystring(states); // Add the new parameter with the selected option value
          if(push){
            history.pushState(states, '', newURL); // Update the URL without reloading the page
          };
          //console.log("**** push updateFocusURL ****",newURL);
          openModal(value, text, images);
      }
      
      
        
        function getURLparams() {
            var urlParams = new URLSearchParams(window.location.search);
            var params = {};

            // Loop through all parameter keys
            for (const key of urlParams.keys()) {
                // Use getAll() method to retrieve all values associated with the key
                params[key] = urlParams.getAll(key);
            }
            return params;
        }

        // Listen for the popstate event to detect URL changes
        //window.navigation.addEventListener('navigate', function(event) {
        //});
        
        //window.addEventListener('beforeunload', function(event) {
        //    if (map2) {
        //      map2.removeLayer("observations"); // Remove the map
        //      //map2 = null; // Clear reference to map instance
        //    }
        //});
        
        function reset_map(){
            const staticmap = document.getElementById('map');
            map2.innerHTML='';
            staticmap.style.display = 'block';
            map2.style.display = 'none';
        }
        
        
        window.addEventListener('popstate', function(event) {
            //console.log("****popstate******", window.location.href);
            //map2.remove();
            //map2.removeSource("example_source");
            //map2.removeLayer("observations");
            

            //const staticmap = document.getElementById('map');
            //if(map2.style.display === 'block') {
            //    map2.style.display === 'none'
            //    staticmap.style.display = 'block';
            //};
            reset_map();
            
            if(document.getElementById("myGallery").style.display == 'block') {
                //urlParams = new URLSearchParams(window.location.search);
                //const focus = currenturl.split('?')[1];  
                //var states = {};
                //states["focus"] = focus; 
                closeGallery(true);
                //updateGallery(event.state.group, event.state.taxon);
                //history.replaceState(states, '', currenturl);
            } else if (modal.style.display == 'block') {
                closeModal(false);
            } else {
                const params = getURLparams();
                //const group = Object.keys(params)["group"];
                //const taxon = params[group][0];
                //last_value = taxon;
                last_value = event.state.taxon;
                updateGallery(event.state.group, event.state.taxon);
                if('focus' in params) {
                  //const imageContainers = document.querySelectorAll('.image-container');
                  //const imageContainers = document.querySelectorAll('.image-container');
                  //document.addEventListener('DOMContentLoaded', function() {
                    //const container = document.getElementById(event.state.focus+'.image-container');
                    //var event = new MouseEvent('click', {
                    //  bubbles: true,
                    //  cancelable: true,
                    //  view: window
                    //});
                    addModal(params['focus'].toString(), false);
                    //openModal(value, text, images);
                    //container.dispatchEvent(event);
                  //});
                  
                  //container.click();
                }
            };
        });
        
        window.onload = (event) => {
          //const domain = window.location.href.split('?')[0];  
          //var urlParams = window.location.search;
          const querystring = window.location.search.substring(1);
          //history.pushState({ "page": window.location.href }, '', window.location.href); 
          if (querystring != '') {
            var urlParams = new URLSearchParams(window.location.search);
            if(urlParams.has("focus")){
              addModal(urlParams.get("focus"), true);
              document.title = urlParams.get("focus");
            } else if(urlParams.has("latest")) {
              const params = getURLparams();
              const group = Object.keys(params)[0];
              const taxon = params[group][0];
              last_value = taxon;
              updateGallery(group, taxon);
              document.title = 'Latest';
            } else {
              //window.location = domain;
              //history.pushState({ "page": window.location.href }, '', window.location.href); 
              const params = getURLparams();
              const group = Object.keys(params)[0];
              const taxon = params[group][0];
              last_value = taxon;
              updateGallery(group, taxon);
              document.title = taxon;
            };

          }
          return true;
        //    const params = getURLparams();
        //    const firstKey = Object.keys(params)[0];
        //    const firstValue = params[firstKey];
        //    updateGallery(firstKey, firstValue);
        };
        
        function state2querystring(state) {
            let queryString = '';
            let exclude = ["group", "taxon"];
            for (const key in state) {
                if(!(key.includes("group") || key.includes("taxon"))){;
                    if (state.hasOwnProperty(key)) {
                        if (queryString.length > 0) {
                            queryString += '&';
                        }
                        queryString += `${encodeURIComponent(key)}=${encodeURIComponent(state[key])}`;
                    }
                };
            }
            return queryString;
        }
        
        function find_latest(n) {
          let array = data;
          let key = "date";
          
          array.sort((a, b) => {
              if (a[key] < b[key]) {
                  return 1; // Return 1 to indicate that 'a' comes after 'b'
              }
              if (a[key] > b[key]) {
                  return -1; // Return -1 to indicate that 'a' comes before 'b'
              }
              return 0; // Return 0 if the values are equal
          });
          return array.slice(0, n);
        }
        

        
        
        