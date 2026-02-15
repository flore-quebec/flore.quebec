


  function extractParts(text) {
      // Find everything before the first period, including the period
      const firstPointIndex = text.indexOf('.');
      const beforeFirstPoint = firstPointIndex !== -1 ? text.slice(0, firstPointIndex + 1) : text;

      const wordsList = ["famille", "genre", "section", "sous-famille", "tribu", "sous-tribu", "sous-genre", "sous-section", "série", "espèce", "Clé"]; 
      const regex = new RegExp(wordsList.join("|"), "g");
      // Find everything from after the first period up to the last capital letter or last number
      const lastCapitalIndex = Math.max(...Array.from(text.matchAll(regex), match => match.index));
      //const lastNumberIndex = text.match(/\d$/) ? text.length - 1 : -1;
      const match = text.match(/(\d+)\D*$/);
      const lastNumberIndex = match ? text.lastIndexOf(match[1]) : -1;


      // Determine the split index for the third part: last capital or last number
      const splitIndex = lastNumberIndex > lastCapitalIndex ? lastNumberIndex : lastCapitalIndex;

      // Extract the middle and third parts based on split index
      const betweenFirstPointAndLastCapitalOrNumber = 
          firstPointIndex !== -1 && splitIndex !== -1 
          ? text.slice(firstPointIndex + 1, splitIndex) 
          : '';
      const afterLastCapitalOrNumber = splitIndex !== -1 ? text.slice(splitIndex) : '';

      //console.log(beforeFirstPoint.match(/\d+/) + '_' + afterLastCapitalOrNumber.match(/\d+/)); 

      //console.log("afterLastCapitalOrNumber", afterLastCapitalOrNumber);

      return {
          beforeFirstPoint,
          betweenFirstPointAndLastCapitalOrNumber,
          afterLastCapitalOrNumber
      };
      

      
  }


  function extractAndDisplay(taxon) {
      const gettaxon = taxa.filter(tax => ((taxon === tax.taxa.replaceAll("_"," "))))[0];
      const pathkey = gettaxon.key;
      const pathtaxon = gettaxon.key.replace("_clé.", "_taxon.");
      const urlkey = "https://raw.githubusercontent.com/flore-quebec/keys/refs/heads/main/" + pathkey;
      //const urlkey = "https://cdn.hebergix.com/fr/floreqc/viola.md";
      //const urlkey = "https://raw.githubusercontent.com/flore-quebec/data/refs/heads/main/viola.md";
      const urltaxon = "https://raw.githubusercontent.com/flore-quebec/keys/refs/heads/main/" + pathtaxon;
      if(pathkey === ""){
        document.getElementById("taxon_key").innerHTML = '';
        document.getElementById("taxon_text").innerHTML = '';
        disableKey();
      } else {
        Promise.all([
          fetch(urltaxon),
          fetch(urlkey)
        ])
          .then(responses => {
              return Promise.all([
                responses[0].text(),  // Resolve the first response's text
                responses[1].text()   // Resolve the second response's text
              ]);
          })
          .then(([taxonText, keyText])  => {
            //console.log(taxonText);
            document.getElementById("taxon_text").innerHTML = marked.parse(taxonText);
            return keyText;
            
            //let tex;
            //const tex = ``;
            //return tex;
   
          })
          .then(texte => {
              // Regular expression to match italicized text (text wrapped in * or _)
              const italicRegex = /(\*([^*]+)\*|_([^_]+)_)/g;
              
              // Replace italic Markdown with <i> HTML tags manually
              let text = texte.replaceAll("__", "").replaceAll("**", "");
              //let text = document.getElementById('userInput').value;
              text = text.replace(italicRegex, (match, p1, p2, p3) => {
                  const italicText = p2 || p3; // Capture text inside * or _
                  return `<i>${italicText}</i>`; // Change <em> to <i>
              });                      
            
              const keyContainer = document.getElementById("taxon_key");

              // Clear previous results
              keyContainer.innerHTML = '';
              
              let splittedKey = splitKey(text);
              let letterCode = "A".charCodeAt(0);

              const parts = [];
              //let to;
              let from;
             
              splittedKey.forEach((keyPart, i) => {
                  let margintop;
                  if(i === 0){
                    margintop = 0;
                  } else {
                    margintop = 10;
                  }
                  const lines = keyPart.text.split(/\n\s*\n+/); // ignore blank space between newlines (e.g. Polygonatum key)
                  const keyTitle = keyPart.title.trim();
                  let letter;
                  let borderBottom;
                  if(keyTitle === '') {
                    letter = 0;
                    borderBottom = '0px solid red';
                  } else {
                    borderBottom = 'inherit'; 
                    if(keyTitle.includes('Clé A')) {
                      letter = 'A';//String.fromCharCode(letterCode + i - 1);
                    } else {
                      if(i === 0){
                        letter = 0;
                      } else {
                        letter = String.fromCharCode(letterCode + i - 1);
                      }
                    }
                  }
                  //console.log('letter', letter);
                  
                  const keyRef = 'Clé' + letter;
                  //console.log('keyRef' + i, keyRef);
                  let count = 0; //-1

                  const kindex = parts.findIndex(row => row[1] === keyRef);
                  //console.log('kindex', kindex);
                  let keyTo;
                  if(kindex === -1){
                    parts.push([keyRef, 'none', 0]);
                    keyTo = keyRef;
                  } else {
                    parts.push([keyRef, parts[kindex][0], 0]);
                    keyTo = parts[kindex][0];
                  }
                  //console.log('matched', parts[kindex][0]);

                  keyContainer.innerHTML += `<div class="keyRow" id=${keyRef} style="margin-top: ${margintop}vh; margin-bottom: 2vh; border-bottom: ${borderBottom}; font-size: 5vh; color: var(--green);"><a class="akey" href=#${keyTo}>${keyTitle}</a></div>`;                  
                  
                  //console.log('parts', parts[parts.length - 1]);

                  lines.forEach((line, j) => {
                      //console.log(line);
                      const result = extractParts(line.trim());
                      const keyid = letter + 'k' + result.beforeFirstPoint.replace(".","").replace("'","_");
                      let keyidnext;
                      let potentialTitle = result.beforeFirstPoint.trim();
                      const off = 1;
                      if(potentialTitle.startsWith('Section ')){
                        keyidnext = letter + 'k' + extractParts(lines[j+1].trim()).beforeFirstPoint.replace(".","").replace("'","_");
                        count = parts[parts.findIndex(row => row[1] === keyidnext.replace("_",""))][2] + off//[2];
                      } else {
                        if(keyid.endsWith('k1') || keyid.endsWith('k1_')){
                          count = 0; //parts[parts.findIndex(row => row[1] === keyid.replace("_",""))][2];
                        } else {
                          count = parts[parts.findIndex(row => row[1] === keyid.replace("_",""))][2] + off//[2];
                        }
                      }
                      
                      let count2;
                      //console.log(window.innerWidth);
                      if(window.innerWidth > 600){ // ignore key offset if on mobile
                        count2 = count * 1;
                      }else{
                        count2 = 0;
                      }
                      
                      
                      if(potentialTitle.startsWith('Section ')){
                        keyContainer.innerHTML += `<div class="keyRow" style="margin-left: ${count2}vw; padding-top: 2vh; padding-bottom: 2vh; color: var(--green); font-weight: 300; font-size: 3vh;">${potentialTitle.replace('Section ','')}</div>`;
                      } else {
                        
                        // Determine the style for the third part
                        let keyRightContent;
                        const keyid = letter + 'k' + result.beforeFirstPoint.replace(".","").replace("'","_");
                        let keyidalt;
                        let kindex;
                        if(keyid.includes("_")){
                          keyidalt = keyid.replace("_","");
                        } else {
                          //keyidalt = keyid + "_";
                          //const index = parts.findIndex(row => row[1] === x);
                          kindex = parts.findIndex(row => row[1] === keyid);
                          if(kindex === -1){
                            //keyidalt = keyid;
                            if(i !== 0){
                              keyidalt = parts[parts.length - 1][1];
                            } else {
                              if(keyTitle === ''){
                                keyidalt = '#'; // hacky just to remove the highlighted empty title
                              } else {
                                keyidalt = parts[0][0];
                              }
                            }
                          } else {
                            keyidalt = parts[kindex][0];
                          }
                        }
                        //console.log('keyidalt',keyidalt);
                        const withgenus = ["sous-genre", "section", "sous-section", "série"];
                        let taxonq = result.afterLastCapitalOrNumber
                          .replace(' (en partie)', '')
                          .replace(/\s*var\..*$/, "")
                          .replace(" ", "=")
                          .replaceAll(" ", "+");
                        if(withgenus.includes(taxonq.split("=")[0])) {
                          taxonq = taxonq.replace("=", "=" + taxon + "+" + taxonq.split("=")[0] + "+");
                        };
                        const [, ...rest] = result.afterLastCapitalOrNumber.split(" ");
                        const taxond = rest.join(" ")
                          .replaceAll(" ", "&nbsp")
                          .replace(/-/g, '\u2011')
                          .replace("&nbspvar.&nbsp",'<span style="font-style: normal;">&nbspvar.&nbsp</span>')
                          .replace("(en&nbsppartie)",'<span style="font-style: normal; font-weight: 300;">(en&nbsppartie)</span>');
                        const keyidto = letter + 'k' + result.afterLastCapitalOrNumber;
                        //console.log('keyidto',keyidto);
                        if (/\d/.test(result.afterLastCapitalOrNumber[0])) {  
                            // Starts with a number
                            keyRightContent = `<div class="keyRight"><a class="akey" href=#${keyidto}>${result.afterLastCapitalOrNumber.replaceAll(" ", "&nbsp")}</a></div>`;
                            from = keyidto;
                        } else {
                            if (result.afterLastCapitalOrNumber.startsWith('Clé')) {
                              const tokey = result.afterLastCapitalOrNumber.replaceAll("Clé ", "");
                              const moveto = 'Clé' + String.fromCharCode(tokey.charCodeAt(0)); 
                              keyRightContent = `<div class="keyRight"><a class="akey" href=#${moveto}>${result.afterLastCapitalOrNumber.replaceAll(" ", "&nbsp")}</a></div>`;
                              from = moveto;
                            } else {
                              // Starts with a letter
                              const wi = taxa.findIndex(tax => taxonq.split("=")[1].replace('+', ' ') === tax.taxa);
                              if(taxond.includes('×') || wi === -1){
                                keyRightContent = `<div class="keyRight"><em><div class="akeynotclickable">${taxond}</div></em></div>`;
                              } else {
                                keyRightContent = `<div class="keyRight"><em><a class="akey" href="?${taxonq}">${taxond}</a></em></div>`;
                              }
                              from = taxond;
                            }
                        };
                        
                        
                        const lineOutput = `
                            <div class="keyRow"  id=${keyid} style="margin-left: ${count2}vw;">
                                <div class="keyPart keyLeft"><a class="akey" href=#${keyidalt}>${result.beforeFirstPoint}</a></div>
                                <div class="keyPart keyMiddle">${result.betweenFirstPointAndLastCapitalOrNumber}</div>
                                ${keyRightContent}
                            </div>
                        `;
                        keyContainer.innerHTML += lineOutput;
                        parts.push([keyid, from, count2]);
                        //console.log('parts', parts[parts.length - 1], count2);
                      };
                  });
              });    
              attachHighlightListeners();
              
                // Add stopPropagation to all anchor tags with the class "link"
              document.querySelectorAll('#taxon_key .akey').forEach(link => {
                link.addEventListener('click', function(event) {
                  event.stopPropagation();
                });
              });
              
              //const key = document.getElementById("taxon_key");
              //key.innerHTML = keyContainer;
        });
      };
  }
  
  
  // Function to highlight the div temporarily
  function highlightDiv(id) {
      const div = document.getElementById(id);
      //console.log(div);
      if (div) {
          div.classList.add('highlight'); // Add highlight class
          setTimeout(() => {
              div.classList.remove('highlight'); // Remove highlight class after 1 second
          }, 3000); // Change the duration as needed
      }
  }      
  
  // Attach click event listeners to all anchor links
  function attachHighlightListeners() {
  const links = document.querySelectorAll('a[href^="#"]');
  //console.log('links', links);
  links.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default anchor behavior
          const targetId = this.getAttribute('href').substring(1); // Get the target id
          //console.log('this.getAttribute(href)', this.getAttribute('href').substring(1));
          const targetElement = document.getElementById(targetId);
          //console.log('targetElement', targetElement);
          if (!isElementInViewport(targetElement)) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
          highlightDiv(targetId); // Highlight the target div

      });
  });        
  }

  
  function isElementInViewport(el, marginVh = 20) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
  
    const marginPx = (marginVh / 100) * vh;
  
    return (
      rect.top    >= marginPx &&
      rect.bottom <= vh - marginPx
    );
  }
  
  
  function splitKey(input) {
    const lines = input.split(/\r?\n/);
    //console.log('lines', lines);
    const blocks = [];
    let current = { title: "", text: "" }; // default first block
  
    for (const line of lines) {
      if (line.trim().startsWith("Clé")) {
  
        // If the default block has content, push it
        if (current.text.trim() !== "") {
          current.text = current.text.trim();
          blocks.push(current);
        }
  
        // Start new block
        current = { title: line.trim(), text: "" };
  
      } else {
        current.text += line + "\n";
      }
    }
  
    // push last one
    if (current.text.trim() !== "") {
      current.text = current.text.trim();
      blocks.push(current);
    }
  
    return blocks;
  }


  
