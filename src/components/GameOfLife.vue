<template>
  <div class="text-center">
    <div>Loading ... enjoy this game of life 🧬</div>
    <canvas id="affichage" width="0" height="0">
      Votre navigateur ne supporte pas les canvas.
    </canvas>
  </div>
</template>

<script>


export default {
  mounted() {
    "use strict";

    let longueur_canvas = 800,
      largeur_canvas = 800,
      taille_cellule = 2,
      fps = 30,
      boucle = false,
      couleurs = false,
      longueur = Math.floor(longueur_canvas / taille_cellule),
      largeur = Math.floor(largeur_canvas / taille_cellule),
      couleur_cellule_vivante = "#000";

    const FIGURES_DEPART = {
      // Planneur: [
      //   [-1, 0],
      //   [0, 0],
      //   [0, -1],
      //   [1, -1],
      //   [1, 1],
      // ],
      // HWSS: [
      //   [-3, -1],
      //   [-3, 1],
      //   [-2, 2],
      //   [-1, 2],
      //   [0, 2],
      //   [1, 2],
      //   [2, 2],
      //   [3, 2],
      //   [3, 1],
      //   [3, 0],
      //   [2, -1],
      //   [0, -2],
      //   [-1, -2],
      // ],
      pentominoR: [
        [2, 2],
        [2, 1],
        [2, 3],
        [3, 2],
        [1, 3],
      ],
      lapins: [
        [1, 2],
        [3, 2],
        [6, 2],
        [5, 1],
        [7, 1],
        [6, 3],
        [2, 3],
        [2, 4],
        [8, 4],
      ],
      "Canon à Planneurs": [
        [-18, 0],
        [-17, 0],
        [-17, -1],
        [-5, -4],
        [-6, -4],
        [-7, -3],
        [-8, -2],
        [-8, -1],
        [-8, 0],
        [-7, +1],
        [-6, +2],
        [-5, +2],
        [+5, -1],
        [+6, -1],
        [+6, -2],
        [+5, +3],
        [+6, +3],
        [+6, +4],
        [+8, 0],
        [+9, 0],
        [+8, +1],
        [+9, +1],
        [+10, +1],
        [+8, +2],
        [+9, +2],
        [+16, +2],
        [+17, +2],
        [+17, +1],
      ],
      "Jardins d'Éden": [
        [-5, -5],
        [-3, -5],
        [-2, -5],
        [0, -5],
        [+1, -5],
        [+4, -5],
        [-4, -4],
        [-2, -4],
        [-1, -4],
        [0, -4],
        [+2, -4],
        [+3, -4],
        [+4, -4],
        [-4, -3],
        [-3, -3],
        [-1, -3],
        [0, -3],
        [+1, -3],
        [+3, -3],
        [+5, -3],
        [-5, -2],
        [-3, -2],
        [-2, -2],
        [-1, -2],
        [+1, -2],
        [+2, -2],
        [+3, -2],
        [+5, -2],
        [-6, -1],
        [-5, -1],
        [-4, -1],
        [-3, -1],
        [-2, -1],
        [+1, -1],
        [+2, -1],
        [+3, -1],
        [+4, -1],
        [-5, 0],
        [-4, 0],
        [-2, 0],
        [-1, 0],
        [0, 0],
        [+2, 0],
        [+5, 0],
        [-5, +1],
        [-4, +1],
        [-3, +1],
        [-1, +1],
        [+1, +1],
        [+4, +1],
        [-5, +2],
        [-4, +2],
        [-2, +2],
        [-1, +2],
        [0, +2],
        [+3, +2],
        [+4, +2],
        [-6, +3],
        [-4, +3],
        [-3, +3],
        [-2, +3],
        [0, +3],
        [+1, +3],
        [+2, +3],
        [+4, +3],
        [-6, +4],
        [-3, +4],
        [-2, +4],
        [+1, +4],
        [+3, +4],
        [+5, +4],
        [+4, +5],
      ],
    };

    let grille_prec,
      grille,
      canvas,
      context,
      idInterval_boucle,
      fps_actuels = fps;


    function initialiser(figure) {
      grille = [];
      grille_prec = [];
      let x, y;
      for (x = 0; x < longueur; x++) {
        grille[x] = [];
        grille_prec[x] = [];
        for (y = 0; y < largeur; y++) {
          grille[x][y] = 0;
          grille_prec[x][y] = 0;
        }
      }
      let milieu_x = Math.floor(longueur / 2),
        milieu_y = Math.floor(largeur / 2);
      context.fillStyle = couleur_cellule_vivante;
      for (let i = figure.length - 1; i >= 0; i--) {
        x = figure[i][0] + milieu_x;
        y = figure[i][1] + milieu_y;
        console.log(`x: ${x}, y: ${y}`);
        grille[x][y] = 1;
        grille_prec[x][y] = 1;
        dessiner(x, y);
      }
    }

    let pair = true,
      nbChangements,
      sommeVoisins,
      x_gauche,
      x_droite,
      y_haut,
      y_bas,
      condX0,
      condXM,
      condY0,
      condYM;
    function mettreAJour() {
      let debut = Date.now();
      nbChangements = 0;
      couleurs && context.clearRect(0, 0, longueur_canvas, largeur_canvas);
      for (let x = longueur - 1; x >= 0; x--) {
        sommeVoisins = 0;
        for (let y = largeur - 1; y >= 0; y--) {
          if (boucle) {
            x_gauche = (x - 1 + longueur) % longueur;
            x_droite = (x + 1) % longueur;
            y_haut = (y - 1 + largeur) % largeur;
            y_bas = (y + 1) % largeur;
            sommeVoisins =
              grille_prec[x_gauche][y_haut] +
              grille_prec[x][y_haut] +
              grille_prec[x_droite][y_haut] +
              grille_prec[x_gauche][y] +
              grille_prec[x_droite][y] +
              grille_prec[x_gauche][y_bas] +
              grille_prec[x][y_bas] +
              grille_prec[x_droite][y_bas];
          } else {
            x_gauche = x - 1;
            x_droite = x + 1;
            y_haut = y - 1;
            y_bas = y + 1;
            condX0 = x > 0;
            condY0 = y > 0;
            condXM = x_droite < longueur;
            condYM = y_bas < largeur;
            sommeVoisins =
              (condX0
                ? (condY0 ? grille_prec[x_gauche][y_haut] : 0) +
                grille_prec[x_gauche][y] +
                (condYM ? grille_prec[x_gauche][y_bas] : 0)
                : 0) +
              (condY0 ? grille_prec[x][y_haut] : 0) +
              (condYM ? grille_prec[x][y_bas] : 0) +
              (condXM
                ? (condY0 ? grille_prec[x_droite][y_haut] : 0) +
                grille_prec[x_droite][y] +
                (condYM ? grille_prec[x_droite][y_bas] : 0)
                : 0);
          }
          if (sommeVoisins === 3 && !grille_prec[x][y]) {
            grille[x][y] = 1;
            if (couleurs) dessiner(x, y, "#0f0");
            else dessiner(x, y, "#000");
            nbChangements++;
          } else if (
            sommeVoisins !== 3 &&
            sommeVoisins !== 2 &&
            grille_prec[x][y]
          ) {
            grille[x][y] = 0;
            if (couleurs) dessiner(x, y, "#f00");
            else vider(x, y);
            nbChangements++;
          } else if (couleurs && grille_prec[x][y]) {
            context.fillStyle = couleur_cellule_vivante;
            dessiner(x, y, couleur_cellule_vivante);
          }
        }
      }
      // context.fillStyle = fps_actuels > fps ? "#0f0" : "#f00";
      // context.fillText(`FPS : ${fps_actuels > fps ? fps : fps_actuels}`, 5, 15);
      if (!nbChangements) clearInterval(idInterval_boucle);
      for (let x = longueur - 1; x >= 0; x--) grille_prec[x] = grille[x].slice(0);
      let duree = Date.now() - debut;
      fps_actuels = 1000 / duree;
    }

    function vider(x, y) {
      context.clearRect(
        taille_cellule * x,
        taille_cellule * y,
        taille_cellule,
        taille_cellule
      );
    }
    function dessiner(x, y, color) {
      color && (context.fillStyle = color);
      context.fillRect(
        taille_cellule * x,
        taille_cellule * y,
        taille_cellule,
        taille_cellule
      );
    }

    const selectedFigureIndex = Math.floor(Math.random() * Object.keys(FIGURES_DEPART).length);
    // const selectedFigureIndex = 0
    console.log(selectedFigureIndex);

    console.log(`Recherche du canvas.`);
    console.log(`Recherche du canvas.`);
    console.log((FIGURES_DEPART.length));
    console.log('document.getElementById("affichage")');
    console.log(document.getElementById("affichage"));
    if ((canvas = document.getElementById("affichage"))) {
      console.log(`Création du contexte.`);
      context = canvas.getContext("2d");
      context.fillStyle = couleur_cellule_vivante;
      console.log(context);
      console.log(`Initialisation de la grille (${longueur}×${largeur}=${longueur * largeur}).`);
      if (this.idInterval_boucle) clearInterval(this.idInterval_boucle);
      taille_cellule = 4;
      longueur = 80;
      largeur = 50;
      longueur_canvas = canvas.width = longueur * taille_cellule;
      largeur_canvas = canvas.height = largeur * taille_cellule;
      fps = 60;
      boucle = true;
      couleurs = true;
      initialiser(FIGURES_DEPART[Object.keys(FIGURES_DEPART)[selectedFigureIndex]]);
      console.log(`Lancement de la boucle de rafraichissement.`);
      fps && (this.idInterval_boucle = setInterval(mettreAJour, 1000 / fps));
    }
    else console.error("Impossible de trouver le canvas.");
  },

  unmounted() {
    if (this.idInterval_boucle) {
      console.log(`Fin de la boucle de rafraichissement.`);
      clearInterval(this.idInterval_boucle);
    }
  }
}
</script>

<style scoped>
canvas {
	background-color: transparent;
	/* float: left; */
  /* margin-right: 10px; */
  /* position: absolute; */
  /* top: 55px;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; */
}

</style>
