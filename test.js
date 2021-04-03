let villes = [
  {
    montpellier: [
      {
        ville: "clermontFerrand",
        temps: 196
      },
      {
        ville: "saintEtienne",
        temps: 188
      },
      {
        ville: "avignon",
        temps: 71
      }
    ]
  },
  {
    avignon: [
      {
        ville: "valence",
        temps: 77
      },
      {
        ville: "montpellier",
        temps: 71
      }
    ]
  },
  {
    valence: [
      {
        ville: "avignon",
        temps: 77
      },
      {
        ville: "lyon",
        temps: 68
      }
    ]
  },
  {
    lyon: [
      {
        ville: "saintEtienne",
        temps: 54
      },
      {
        ville: "valence",
        temps: 68
      },
      {
        ville: "clermontFerrand",
        temps: 102
      }
    ]
  },
  {
    saintEtienne: [
      {
        ville: "lyon",
        temps: 54
      },
      {
        ville: "montpellier",
        temps: 188
      }
    ]
  },
  {
    clermontFerrand: [
      {
        ville: "lyon",
        temps: 102
      },
      {
        ville: "montpellier",
        temps: 196
      }
    ]
  }
]

let villePrecedente = "";
let villeActuelle = "saintEtienne";
let destination = "valence";

let tempsTotal = 0;

let etapesPossibles = [];

let i = 0;

async function villeF(villeActu, villePre, dest, temps) {
  //console.log(`ville actuelle : ${villeActu}\nville précedente : ${villePre}\ntemps : ${tempsTotal}`)


  if (!villes[i][villeActu]) {
    i = i + 1;
    if (i > 10) return
    villeF(villeActuelle, villePrecedente, destination, tempsTotal);
  }
  else {
    for (const villesProches of villes[i][villeActu]) {
      if (villesProches.ville != villePre) {
        etapesPossibles.push(villesProches);
      };

    };

    etapesPossibles.sort(function (a, b) {
      return a.temps - b.temps;
    });

    let villePrec = villeActu;
    let villeActue = etapesPossibles[0].ville;
    let tempsTota = temps + etapesPossibles[0].temps;

    console.log(`Etape : ${etapesPossibles[0].ville}`);

    if (villeActu != dest) {
      villeF(villeActue, villePrec, destination, tempsTota)
    } else {
      console.log(`Temps Total : ${temps}`)
    }
  }
};

villeF(villeActuelle, villePrecedente, destination, tempsTotal);