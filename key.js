


  function extractParts(text) {
      // Find everything before the first period, including the period
      const firstPointIndex = text.indexOf('.');
      const beforeFirstPoint = firstPointIndex !== -1 ? text.slice(0, firstPointIndex + 1) : text;

      const wordsList = ["famille", "genre", "section", "sous-famille", "tribu", "sous-tribu", "sous-genre", "sous-section", "série", "espèce"]; 
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
      //const url = "https://raw.githubusercontent.com/flore-quebec/data/refs/heads/main/Cyperus.md";
      const urlkey = "https://raw.githubusercontent.com/flore-quebec/keys/refs/heads/main/" + pathkey;
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
            console.log(taxonText);
            document.getElementById("taxon_text").innerHTML = marked.parse(taxonText);
            return keyText;
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
            
            
              const lines = text.split(/\n{2,}/);
              const keyContainer = document.getElementById("taxon_key");
    
              // Clear previous results
              keyContainer.innerHTML = '';
    
              const keynum = [];
              const keyoff = [];
              let count = -1;
              // Process each line and display the results
              lines.forEach(line => {
                
                  const result = extractParts(line.trim());
                  const ind = Number(result.beforeFirstPoint.match(/\d+/));
                  const off = keynum.indexOf(ind);
                  if(off !== -1){
                    count = keyoff[off];
                  } else {
                    count = count + 1;
                  }
                  keynum.push(ind); 
                  keyoff.push(count);
                  let count2;
                  console.log(window.innerWidth);
                  if(window.innerWidth > 600){
                    count2 = count * 1;
                  }else{
                    count2 = 0;
                  }
                  // Determine the style for the third part
                  let keyRightContent;
                  
                  const keyid = 'k' + result.beforeFirstPoint.replace(".","").replace("'","_");
                  let keyidalt;
                  if(keyid.includes("_")){
                    keyidalt = keyid.replace("_","");
                  } else {
                    keyidalt = keyid + "_";
                  }
                  const withgenus = ["sous-genre", "section", "sous-section", "série"];
                  let taxonq = result.afterLastCapitalOrNumber.replace(" ", "=").replaceAll(" ", "+");
                  if(withgenus.includes(taxonq.split("=")[0])) {
                    taxonq = taxonq.replace("=", "=" + taxon + "+" + taxonq.split("=")[0] + "+");
                  };
                  const [, ...rest] = result.afterLastCapitalOrNumber.split(" ");
                  const taxond = rest.join(" ").replaceAll(" ", "&nbsp");
                  const keyidto = 'k' + result.afterLastCapitalOrNumber;
                  if (/\d/.test(result.afterLastCapitalOrNumber[0])) {  
                      // Starts with a number
                      keyRightContent = `<div class="keyRight"><a class="akey" href=#${keyidto}>${result.afterLastCapitalOrNumber.replaceAll(" ", "&nbsp")}</a></div>`;
                  } else {
                      // Starts with a letter
                      keyRightContent = `<div class="keyRight"><em><a class="akey" href="https://florequebec.ca?${taxonq}">${taxond}</a></em></div>`;
                  };
                  
                  
                  const lineOutput = `
                      <div class="keyRow"  id=${keyid} style="margin-left: ${count2}vw;">
                          <div class="keyPart keyLeft"><a class="akey" href=#${keyidalt}>${result.beforeFirstPoint}</a></div>
                          <div class="keyPart keyMiddle">${result.betweenFirstPointAndLastCapitalOrNumber}</div>
                          ${keyRightContent}
                      </div>
                  `;
                  keyContainer.innerHTML += lineOutput;
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
  links.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default anchor behavior
          const targetId = this.getAttribute('href').substring(1); // Get the target id
          const targetElement = document.getElementById(targetId);
          if (!isElementInViewport(targetElement)) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
          highlightDiv(targetId); // Highlight the target div

      });
  });        
  }
     
  
  function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  }        
  
  
  
  
