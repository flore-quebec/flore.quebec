
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
        //console.log(last_category);
        //console.log(last_value);

        function openModal(headerText, bodyText, imageArray) {
            console.log(imageArray);
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
            //console.log(temp);
            var url = "https://raw.githubusercontent.com/flore-quebec/species/main/Esp%C3%A8ces/"+data[which].famille+"/"+data[which].genre+"/"+data[which].espèce.replace(" ","_")+".md"

            fetch(url)
              .then(r=>r.blob()).then(b=>b.text()).then(m => {modalText.innerHTML=marked.parse(m)});


            // Add images to modal
            // var isna; 
            imageArray.forEach(function (imageUrl, index) {
                console.log(index);
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
                //console.log(isna);
                if(imageUrl != 'NA') {
                  image.onclick = function() {openGallery(imageUrl, index);};
                };
                
                modalImages.appendChild(image);
                //<img class="thumbnail-image" src=${imageUrl} alt="Image 1" onclick="openGallery(${imageUrl}, 0)">
            });

            const taxonomy = document.getElementById('taxonomy');
            taxonomy.innerHTML=data[which].class+'&nbsp>&nbsp'+data[which].ordre+'&nbsp>&nbsp'+data[which].famille+'&nbsp>&nbsp'+data[which].genre;
            const right = document.getElementById('links');

            //console.log(makeLink(data[which].vascan,"vascan"));

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
            //console.log(data[which]);

            const edit_link = "https://github.com/flore-quebec/species/tree/main/Esp%C3%A8ces/"+data[which].famille+"/"+data[which].genre+"/"+data[which].espèce.replace(" ","_")+".md";
            edit.innerHTML = '<a class=\"edit\" href=\"' + edit_link + '\" target=\"_blank\">Éditez sur GitHub<img class="minioctocat" src="https://cdn.hebergix.com/fr/floreqc/github-mark.png"></a>';

            const map = document.getElementById('map');
            const pheno = document.getElementById('pheno');
            map.src = "https://cdn.hebergix.com/fr/floreqc/"+headerText.replace(" ","_")+"_map.png";
            pheno.src = "https://cdn.hebergix.com/fr/floreqc/"+headerText.replace(" ","_")+"_pheno.png";

        }


        function closeModal() {
            modalImages.innerHTML = '';
            modal.style.display = 'none';
        }

        // Function to close the gallery
        function closeGallery() {
            const gallery = document.getElementById("myGallery");
            gallery.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target === modal) {
                closeModal();
            };
            if (event.target === gallery) {
                closeGallery();
            };
        };


        function updateGallery(group) {

            const order = document.getElementsByName('order');

            //console.log(group);
            //console.log(familleSelect.value);

            //let selected;
            let selected;
            var filteredImages;
            let indexsp;
            let indexn;

            if (group === "famille") {
              selected = familleSelect.value;
              //last_value = familleSelect.value;
              filteredImages = data.filter(image => (
                (selected === image.famille)
              ));
            } else if (group === "genre") {
              selected = genreSelect.value;
              //last_value = genreSelect.value;
              filteredImages = data.filter(image => (
                (selected === image.genre)
              ));
              //console.log(filteredImages);
            } else if (group === "species") {
              selected = speciesSelect.value;
              //last_value = genreSelect.value;
              filteredImages = data.filter(image => (
                (selected === image.espèce)
              ));
            } else if (group === "nom") {
              selected = nomSelect.value;
              //console.log(selected);
              //last_value = genreSelect.value;
              indexsp = nom_values.findIndex(p => p == selected);
              indexn = common_names[indexsp][selected.replaceAll(" ","_").replaceAll("-","_").replaceAll("'","_")];
              console.log(indexn);
              filteredImages = indexn.map(index => data[index]);
              //filteredImages = data[common_names[indexn]];              
            } else {
              selected = speciesSelect.value;
              //last_value = speciesSelect.value;
              filteredImages = data.filter(image => (
                (selected === image.espèce)
              ));
            };

            last_category = group;
            last_value = selected;

            if(group === "famille" || group === "genre") {
              document.getElementById("selected").innerHTML = selected;
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

            imageContainers.forEach((container, index) => {
                container.addEventListener('click', () => {
                    //const title = container.querySelector('.image-title').textContent;
                    const title = container.id;
                    const text = '';

                    const index = data.findIndex(p => p.espèce == title); // tests
                    const images = data[index].images;
                    thumbnails = images.filter(z => z != 'NA');
                    which = index;
                    
                    openModal(title, text, images);
                });
            });


        }

        // Function to open the gallery with a specific image
        function openGallery(imageSrc, index) {
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


        familleSelect.addEventListener("change", () => updateGallery("famille"));
        genreSelect.addEventListener("change", () => updateGallery("genre"));
        speciesSelect.addEventListener("change", () => updateGallery("species"));
        nomSelect.addEventListener("change", () => updateGallery("nom"));


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
              updateGallery(last_category);
            };
        }


        function linkExists(link) {
          if(link === "" || link === "NA") {
            //console.log(link);
            link;
          } else {
            //console.log("no link");
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
          //console.log(pro);
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
            const resultString = italicizedPart + inputString.substring(secondSpaceIndex);

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
            if( diffX > diffY && diffX > 5){
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

        let isClicked = false;
      
        image.addEventListener('click', function(event) {
          if (!isClicked) {
            image.classList.add('zoomed');
            isClicked = true;
            image.style.cursor = 'zoom-out';
            let x = event.offsetX;
            let y = event.offsetY;
            image.style.transformOrigin = `${x}px ${y}px`; /* Adjust transform origin based on mouse position */
          } else {
            image.classList.remove('zoomed');
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
           image.classList.remove('zoomed');
           isClicked = false;
           image.style.cursor = 'zoom-in';
        } 
        
        image.addEventListener('mouseout', function(event) {
           zoom_reset();
        });
        
        /*
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

      // we first fetch the header so we can get the center lon, lat of the map.
      function species_occs(sp) {
  
          const PMTILES_URL = 'https://object-arbutus.cloud.computecanada.ca/bq-io/acer/niches_climatiques/obs/' + sp + '.pmtiles';
  
          const p = new pmtiles.PMTiles(PMTILES_URL);
  
          // this is so we share one instance across the JS code and the map renderer
          protocol.add(p);
  
          p.getHeader().then(h => {
              var map2 = new maplibregl.Map({
                  container: 'map2',
                  zoom: h.maxZoom -4,
                  //center: [h.centerLon, h.centerLat],
                  center: [-73, 45],
                  style: {
                      version:8,
                      sources: {
                          'example_source': {
                              type: 'vector',
                              url: `pmtiles://${PMTILES_URL}`,
                              attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
                          },
                          'raster-tiles': {
                          'type': 'raster',
                          'tiles': [
                              // NOTE: Layers from Stadia Maps do not require an API key for localhost development or most production
                              // web deployments. See https://docs.stadiamaps.com/authentication/ for details.
                              //'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.jpg'
                              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                              //'http://c.tile.opentopomap.org/{z}/{x}/{y}.png'
                          ],
                          'tileSize': 256,
                          'attribution':
                              'Map tiles by <a target="_blank" href="http://stamen.com">Stamen Design</a>; Hosting by <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>. Data &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors'
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
                              'id': 'Setophaga_cerulea',
                              'source': 'example_source',
                              'source-layer': sp,
                              'type': 'circle',
                              'paint': {
                                  'circle-color': 'forestgreen',
                                  'circle-radius': 5,
                                  'circle-stroke-color': 'black',
                                  'circle-stroke-opacity': 0.95,
                                  'circle-stroke-width': 0.5,
                              }
                          }
                      ]
                  }
              });
          });
      }
      
      species_occs("Aquila_chrysaetos");
      */
        