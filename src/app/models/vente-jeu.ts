interface TVenteJeu {
    _id: string;
    idJeuDepot: string;
    idVente: string;
    jeuNom?: string;
    editeurNom?: string;
    prixJeu?: number;
    quantiteVendus: number;
}

export class VenteJeu implements TVenteJeu {
  public _id: string;
  public idJeuDepot: string;
  public idVente: string;
  public jeuNom?: string;
    public editeurNom?: string;
    public prixJeu?: number;
  public quantiteVendus: number;

  constructor(
    _id: string,
    idJeuDepot: string,
    idVente: string,
    quantiteVendus: number
  ) {
    this._id = _id;
    this.idJeuDepot = idJeuDepot;
    this.idVente = idVente;
    this.quantiteVendus = quantiteVendus;
  }
}