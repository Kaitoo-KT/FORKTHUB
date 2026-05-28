// PARTICLES

particlesJS("particles-js", {
  particles: {
    number: {
      value: 90
    },

    color: {
      value: ["#00ffb7", "#8b5cf6", "#00c3ff"]
    },

    shape: {
      type: "circle"
    },

    opacity: {
      value: 0.5
    },

    size: {
      value: 3
    },

    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out"
    },

    line_linked: {
      enable: true,
      distance: 140,
      color: "#00ffb7",
      opacity: 0.15,
      width: 1
    }
  },

  interactivity: {
    detect_on: "canvas",

    events: {
      onhover: {
        enable: true,
        mode: "grab"
      },

      resize: true
    },

    modes: {
      grab: {
        distance: 160,
        line_linked: {
          opacity: 0.3
        }
      }
    }
  },

  retina_detect: true
});


// SCROLL ANIMATION

const reveals = document.querySelectorAll(".reveal");

function revealElements() {

  reveals.forEach((element) => {

    const windowHeight = window.innerHeight;

    const elementTop = element.getBoundingClientRect().top;

    const visible = 100;

    if (elementTop < windowHeight - visible) {
      element.classList.add("active");
    }

  });

}

window.addEventListener("scroll", revealElements);

revealElements();


// SMOOTH CARD FLOAT EFFECT

const cards = document.querySelectorAll(".pricing-card");

cards.forEach(card => {

  card.addEventListener("mousemove", (e) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
    `;

  });

  card.addEventListener("mouseleave", () => {

    if(card.classList.contains("vip-card")){
      card.style.transform = "scale(1.03)";
    } else {
      card.style.transform = "rotateX(0) rotateY(0)";
    }

  });

});