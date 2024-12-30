interface TVente {
  _id: string;
  acheteur: string;
  vendeur: string;
  acheteurNom?: string;
  vendeurNom?: string; 
  commissionVente: number;
  dateVente: Date;
  montantTotal: number;
}

export class Vente implements TVente {
  public _id: string;
  public acheteur: string;
  public vendeur: string;
  public acheteurNom?: string;
  public vendeurNom?: string;
  public commissionVente: number;
  public dateVente: Date;
  public montantTotal: number;

  constructor(
    _id: string,
    acheteur: string,
    vendeur: string,
    commissionVente: number,
    dateVente: Date,
    montantTotal: number
  ) {
    this._id = _id;
    this.acheteur = acheteur;
    this.vendeur = vendeur;
    this.commissionVente = commissionVente;
    this.dateVente = dateVente;
    this.montantTotal = montantTotal;
  }
}
