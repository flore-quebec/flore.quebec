
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

            // Clear previous images
            modalImages.innerHTML = '';

            modal.style.display = 'block';
            modalHeader.innerHTML = headerText.replace(" "," ");
            //modalText.innerHTML = bodyText;

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
            imageArray.forEach(function (imageUrl, index) {
                const image = document.createElement('img');
                //const image = document.getElementById('modalImages');
                image.classList.add('modal-image');
                image.src = imageUrl.replace("medium","medium");
                image.onclick = function() {openGallery(imageUrl, index);};
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
            //const map = document.getElementById('map');
            //const map = document.getElementById('map');

            scien_complet.innerHTML = italicizeBeforeSecondSpace(data[which].botanic);
            //scien_alternatif.innerHTML = data[which].alternatif;
            verna_fr.innerHTML = data[which].vernaculaire;
            //verna_alternatif_fr.innerHTML = data[which].vernacularFRalt;
            verna_en.innerHTML = data[which].vernacularEN;
            statut.innerHTML = data[which].status;
            protection.innerHTML = makeProtection();

            const edit_link = "https://github.com/flore-quebec/species/tree/main/Esp%C3%A8ces/"+data[which].famille+"/"+data[which].genre+"/"+data[which].espèce.replace(" ","_")+".md"
            edit.innerHTML = '<a class=\"edit\" href=\"' + edit_link + '\" target=\"_blank\">Éditez sur GitHub<img class="minioctocat" src="https://cdn.hebergix.com/fr/floreqc/github-mark.png"></a>'

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
            } else if (group === "species") {
              selected = speciesSelect.value;
              //last_value = genreSelect.value;
              filteredImages = data.filter(image => (
                (selected === image.espèce)
              ));
            } else if (group === "nom") {
              selected = nomSelect.value;
              //last_value = genreSelect.value;
              filteredImages = data.filter(image => (
                (selected === image.vernaculaire)
              ));
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
                //const src = if(image.src === "NA"){"Pas de photo"}else{image.src};

                imageElement.innerHTML = `
                      <img class="image" src=${image.src} alt=${image.alt}>
                      <div class="image-title">
                        ${image.alt}<br>
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
                    const text = `
                        <h2>Traits distinctifs</h2>
                        <p>Ici, on trouve une description possiblement en liste à points ou en continu des traits distinctifs de l'espèce ou des éléments clés pour repérer l'espèce sur le terrain. En d'autres mots, que remarque-t-on de particulier chez cette espèce par rapport aux autres semblables</p>
                        <h2>Espèces semblables</h2>
                        <p>Ici on énumère les critères à regarder pour différencier cette espèces des autres espèces semblables. L'idéal est de cibler les espèces qui sont semblables et de ne pas se perdre dans les espèces qui sont clairement différentes si on regarde attentivement les photos.</p>
                        <h2>Habitat</h2>
                        <p>Description sommaire de l'habitat et possiblement de la répartition. On peut se baser sur l'expérience perso.</p>
                        <h2>Commentaires</h2>
                        <p>Est-ce qu'il y a des remarques à faire pour l'espèce notamment en lien avec la distribution, la taxonomie, le statut ou autres trucs intéressants? On peut aussi parler des sous-espèces ou des variétés ou de certaines particularités.</p>
                    `;

                    const index = data.findIndex(p => p.espèce == title); // tests
                    const images = data[index].images;
                    thumbnails = images;
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

            gallery.style.display = "block";
            //galleryImage.src = imageSrc;
            galleryImage.src = imageSrc.replace("medium","original");
            currentImageIndex = index;
            captionText.innerHTML = data[which].credit[index];
            //linkText.innerHTML = data[which].link[index];
            link = data[which].link[index];
            linkText.innerHTML = '<a class=\"link\" href=\"' + link + '\" target=\"_blank\">' + link + '</a>' ;
            //captionText.innerHTML = '<a class=\"a3\">' + this.title + '</a>';
            //linkText.innerHTML = '<a class=\"a2\" href=\"' + this.alt + '\" target=\"_blank\">' + this.alt + '</a>' ;
        }


        // Function to switch between images in the gallery
        function changeImage(offset) {
            currentImageIndex = (currentImageIndex + offset + thumbnails.length) % thumbnails.length;
            const galleryImage = document.getElementById("galleryImage");
            const captionText = document.getElementById("caption");
            const linkText = document.getElementById("link");
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
        //  console.log("changing order");
          //if(which.length > 1){
            if(last_category === "famille"){
              updateGallery("famille");
            }else{
              updateGallery("genre");
            };
          //};
        }


        function linkExists(link) {
          if(link === "" || link === "NA"){
            //console.log(link);
            link;
          }else{
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
          console.log(touchstartX);
          console.log(touchendX);
          if(Math.abs(touchendX - touchstartX) > Math.abs(touchendY - touchstartY)){
            if (touchendX < touchstartX) changeImage(1)//alert('swiped left!')
            if (touchendX > touchstartX) changeImage(-1)//alert('swiped right!')
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