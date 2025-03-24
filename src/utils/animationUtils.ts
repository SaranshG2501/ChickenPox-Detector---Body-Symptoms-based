export const fadeIn = (element: HTMLElement, duration = 300): Promise<void> => {
  return new Promise((resolve) => {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start: number | null = null;
    
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity.toString();
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    
    window.requestAnimationFrame(step);
  });
};

export const fadeOut = (element: HTMLElement, duration = 300): Promise<void> => {
  return new Promise((resolve) => {
    element.style.opacity = '1';
    
    let start: number | null = null;
    
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = 1 - Math.min(progress / duration, 1);
      
      element.style.opacity = opacity.toString();
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.style.display = 'none';
        resolve();
      }
    }
    
    window.requestAnimationFrame(step);
  });
};

export const slideIn = (element: HTMLElement, direction = 'up', duration = 500): Promise<void> => {
  return new Promise((resolve) => {
    const originalStyles = {
      transition: element.style.transition,
      transform: element.style.transform,
      opacity: element.style.opacity,
    };
    
    // Set initial position based on direction
    let initialTransform = '';
    switch(direction) {
      case 'up':
        initialTransform = 'translateY(20px)';
        break;
      case 'down':
        initialTransform = 'translateY(-20px)';
        break;
      case 'left':
        initialTransform = 'translateX(20px)';
        break;
      case 'right':
        initialTransform = 'translateX(-20px)';
        break;
      default:
        initialTransform = 'translateY(20px)';
    }
    
    element.style.opacity = '0';
    element.style.transform = initialTransform;
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    element.style.display = 'block';
    
    // Trigger reflow
    void element.offsetWidth;
    
    element.style.opacity = '1';
    element.style.transform = 'translate(0, 0)';
    
    setTimeout(() => {
      // Reset transition but keep new position
      element.style.transition = originalStyles.transition;
      resolve();
    }, duration);
  });
};

export const pulseOnce = (element: HTMLElement, duration = 1000): Promise<void> => {
  return new Promise((resolve) => {
    const originalStyles = {
      transition: element.style.transition,
      transform: element.style.transform,
    };
    
    element.style.transition = `transform ${duration/2}ms ease-out`;
    
    // Pulse out
    element.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      // Pulse in
      element.style.transform = 'scale(1)';
      
      setTimeout(() => {
        // Reset transition
        element.style.transition = originalStyles.transition;
        resolve();
      }, duration/2);
    }, duration/2);
  });
};
