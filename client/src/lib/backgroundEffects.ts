// Authentic Studio Ghibli nature animation URLs
const ghibliAnimations = [
  'https://64.media.tumblr.com/e4d1b83a185462203d483208ee47c9ad/956c3818ab04a769-01/s640x960/fb2d3edf281ecdf4968db482f485ba6cb9d7da4a.gif', // Totoro forest scene
  'https://64.media.tumblr.com/94e3f1de5dca432183219d2ee6f99f01/tumblr_ntio5rrhQu1uw5inko1_500.gif', // Howl's Moving Castle meadow
  'https://64.media.tumblr.com/09cca570650bbd77ab15f7a953be7f60/tumblr_o6djzfDOFK1uw5inko1_400.gif', // Princess Mononoke forest
  'https://64.media.tumblr.com/tumblr_m6vojrYKPy1rsdpaso1_500.gif', // Totoro countryside
  'https://64.media.tumblr.com/87ba7c9b06377ae0e02faba7aa628c0c/a72e857bcdcfdebc-f9/s500x750/36f2f61c7b03e2ceebae1cbcd070a1ab63db6ba5.gifv', // Spirited Away landscape
  'https://64.media.tumblr.com/10263c69ee659bce7a00e09c2ceeacc4/tumblr_ndg7xvJ6LD1s5f7v4o1_500.gif', // Kiki's Delivery Service coast
  'https://64.media.tumblr.com/7c4bf76ac26c4d792ab48ba46f19e302/b47fa1b7c79e1aab-e4/s540x810/80b72f8349b99bf389f3b48de33cae539b839049.gif', // Howl's fields with flowers
];

// Function to create a Ghibli animation background with boomerang effect
export function setGhibliAnimationBackground() {
  // Remove any previous animation background
  const existingBg = document.getElementById('ghibli-animation-bg');
  if (existingBg) {
    existingBg.remove();
  }
  
  // Choose a random animation
  const randomIndex = Math.floor(Math.random() * ghibliAnimations.length);
  const selectedAnimation = ghibliAnimations[randomIndex];
  
  // Create the animation container
  const animationContainer = document.createElement('div');
  animationContainer.id = 'ghibli-animation-bg';
  animationContainer.style.position = 'fixed';
  animationContainer.style.top = '0';
  animationContainer.style.left = '0';
  animationContainer.style.width = '100%';
  animationContainer.style.height = '100%';
  animationContainer.style.zIndex = '-1';
  animationContainer.style.opacity = '0.5'; // 50% opacity
  animationContainer.style.backgroundImage = `url('${selectedAnimation}')`;
  animationContainer.style.backgroundSize = 'cover';
  animationContainer.style.backgroundPosition = 'center';
  animationContainer.style.pointerEvents = 'none';
  animationContainer.style.transition = 'all 1s ease';
  
  // Add the animation container to the body
  document.body.appendChild(animationContainer);
  
  // Add the boomerang animation keyframes to the document if they don't exist
  if (!document.getElementById('boomerang-animation')) {
    const style = document.createElement('style');
    style.id = 'boomerang-animation';
    style.textContent = `
      @keyframes boomerang {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      
      @keyframes gentle-breath {
        0% { filter: brightness(1); }
        50% { filter: brightness(1.03); }
        100% { filter: brightness(1); }
      }
      
      #ghibli-animation-bg {
        animation: boomerang 20s ease-in-out infinite, 
                   gentle-breath 15s ease-in-out infinite;
        background-repeat: no-repeat;
      }
    `;
    document.head.appendChild(style);
  }
}

// Function to add animated elements that resemble Ghibli visual elements
export function addGhibliElements() {
  // Create container for animated elements if it doesn't exist
  let container = document.getElementById('ghibli-elements');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ghibli-elements';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.zIndex = '0';
    document.body.appendChild(container);
  }
  
  // Create floating soot sprites (like in Spirited Away/Totoro)
  const spriteCount = Math.floor(Math.random() * 5) + 3;
  for (let i = 0; i < spriteCount; i++) {
    const sprite = document.createElement('div');
    sprite.className = 'soot-sprite';
    sprite.style.position = 'absolute';
    sprite.style.width = `${Math.random() * 10 + 5}px`;
    sprite.style.height = sprite.style.width;
    sprite.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    sprite.style.borderRadius = '50%';
    sprite.style.left = `${Math.random() * 100}vw`;
    sprite.style.top = `${Math.random() * 100}vh`;
    sprite.style.animation = `float ${Math.random() * 5 + 5}s ease-in-out infinite`;
    sprite.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(sprite);
  }
  
  // Create floating dust particles (like in many Ghibli films)
  const dustCount = Math.floor(Math.random() * 20) + 10;
  for (let i = 0; i < dustCount; i++) {
    const dust = document.createElement('div');
    dust.className = 'dust-particle';
    dust.style.position = 'absolute';
    dust.style.width = `${Math.random() * 4 + 1}px`;
    dust.style.height = dust.style.width;
    dust.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    dust.style.borderRadius = '50%';
    dust.style.left = `${Math.random() * 100}vw`;
    dust.style.top = `${Math.random() * 100}vh`;
    dust.style.animation = `sparkle ${Math.random() * 4 + 3}s ease-in-out infinite, float ${Math.random() * 10 + 10}s ease-in-out infinite`;
    dust.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(dust);
  }
}

// Initialize all Ghibli visual effects
export function initializeGhibliEffects() {
  setGhibliAnimationBackground();
  addGhibliElements();
}