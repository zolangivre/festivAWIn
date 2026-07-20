interface TJeuDepot {
  _id: string;
  vendeur: string;
  nomVendeur?: string;
  prenomVendeur?: string;
  nomJeu: string;
  editeurJeu: string;
  prixJeu: number;
  quantiteJeuDisponible: number;
  quantiteJeuVendu: number;
  statutJeu: string;
  dateDepot: string | Date;
  fraisDepot: number;
  remiseDepot: number;
}

export class JeuDepot implements TJeuDepot {
  public _id: string;
  public vendeur: string;
  public nomVendeur?: string;
  public prenomVendeur?: string;
  public nomJeu: string;
  public editeurJeu: string;
  public prixJeu: number;
  public quantiteJeuDisponible: number;
  public quantiteJeuVendu: number;
  public statutJeu: string;
  public dateDepot: string | Date;
  public fraisDepot: number;
  public remiseDepot: number;

  constructor(
    vendeur: string,
    nomJeu: string,
    editeurJeu: string,
    prixJeu: number,
    quantiteJeuDisponible: number,
    quantiteJeuVendu: number,
    statutJeu: string,
    dateDepot: string | Date,
    fraisDepot: number,
    remiseDepot: number,
    _id: string
  ) {
    this.vendeur = vendeur;
    this.nomJeu = nomJeu;
    this.editeurJeu = editeurJeu;
    this.prixJeu = prixJeu;
    this.quantiteJeuDisponible = quantiteJeuDisponible;
    this.quantiteJeuVendu = quantiteJeuVendu;
    this.statutJeu = statutJeu;
    this.dateDepot = dateDepot;
    this.fraisDepot = fraisDepot;
    this.remiseDepot = remiseDepot;
    this._id = _id;
  }
}