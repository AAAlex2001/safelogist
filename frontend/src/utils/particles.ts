import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

export const particlesInit = async (engine: Engine) => {
  await loadSlim(engine);
};

export const particlesOptions = {
  particles: {
    number: {
      value: 110,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#FF8A00"
    },
    shape: {
      type: "circle" as const,
      stroke: {
        width: 0,
        color: "#FF8A00"
      },
      polygon: {
        nb_sides: 5
      }
    },
    opacity: {
      value: 1,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.4,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 1,
        sync: false
      }
    },
    links: {
      enable: true,
      distance: 150,
      color: "#FF8A00",
      opacity: 0.6,
      width: 1.1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none" as const,
      random: true,
      straight: false,
      outModes: "out" as const,
      bounce: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detectsOn: "window" as const,
    events: {
      onHover: {
        enable: true,
        mode: "repulse" as const
      },
      onClick: {
        enable: false,
        mode: "push" as const
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        links: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 100,
        duration: 0.4
      },
      push: {
        quantity: 4
      },
      remove: {
        quantity: 2
      }
    }
  },
  retina_detect: true
};

