 

 
function set_hex() {
 
 
   // Function to generate a seed based on the current date, rounded to the nearest 2 minutes
  function generateSeed() {
      const now = new Date();
      const roundedTime = Math.round(now.getTime() / (2 * 60 * 1000)) * (2 * 60 * 1000); // 10 minutes in milliseconds
      return roundedTime; // Seed is an integer representing the time rounded to 10 minutes
  }
  
  // Function to create a seeded random number generator
  function seededRandom(seed) {
      return function () {
          seed = (seed * 16807) % 2147483647; // Uses a simple LCG with a prime multiplier
          return (seed - 1) / 2147483646;
      };
  }
  
  // Function to generate 12 integers based on array length
  function generateIntegers(arrayLength) {
      const seed = generateSeed();
      const random = seededRandom(seed);
      const integers = [];
  
      for (let i = 0; i < 12; i++) {
          const value = Math.floor(random() * arrayLength);
          integers.push(value);
      }
  
      return integers;
  }
  
  const withpics = data.filter(image => (('' != image.src)))
  const randomIntegers = generateIntegers(withpics.length);
  
  let sampled = randomIntegers.map(index => withpics[index]); 
 
  const hexImages = document.querySelectorAll('.hex');
  
  document.getElementById("hexagon-gallery").style.display = 'flex';
  
  hexImages.forEach((hex, index) => {
    if (sampled[index]) {
      const {src, espèce} = sampled[index];

      const img = hex.querySelector('img');
      img.src = src;
      
      //hex.addEventListener('click', function() { // the a link messes up the layout
         //window.location.href = 'https://florequebec.ca?espèce=' + espèce.replace(" ", "+"); // Redirect to this URL
      //});
    }
  });
  
 };