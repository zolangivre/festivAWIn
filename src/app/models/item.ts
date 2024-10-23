interface TJeuDepot {
  idJeuDepot: number | null;
  idUtilisateur: number | null;
  nomJeu: string;
  editeurJeu: string;
  prixJeu: number;
  quantiteJeu: string;
  statutJeu: string;
  dateDepot: string;
  fraisDepot: number;
  remiseDepot: number;
}

export class JeuDepot implements TJeuDepot {
  public idJeuDepot: number | null;
  public idUtilisateur: number | null;
  public nomJeu: string;
  public editeurJeu: string;
  public prixJeu: number;
  public quantiteJeu: string;
  public statutJeu: string;
  public dateDepot: string;
  public fraisDepot: number;
  public remiseDepot: number;

  constructor(idUtilisateur: number | null, nomJeu: string, editeurJeu: string, prixJeu: number, quantiteJeu: string, statutJeu: string, dateDepot: string, fraisDepot: number, remiseDepot: number, idJeuDepot: number | null = null) {
    this.idUtilisateur = idUtilisateur;
    this.nomJeu = nomJeu;
    this.editeurJeu = editeurJeu;
    this.prixJeu = prixJeu;
    this.quantiteJeu = quantiteJeu;
    this.statutJeu = statutJeu;
    this.dateDepot = dateDepot;
    this.fraisDepot = fraisDepot;
    this.remiseDepot = remiseDepot;
    this.idJeuDepot = idJeuDepot;
  }
}
