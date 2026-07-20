interface TBilan {
  _id: string;
  vendeurId: string;
  sommeDues: number;
  totalFrais: number;
  totalCommissions: number;
  gains: number;
}

export class Bilan implements TBilan {
  public _id: string;
  public vendeurId: string;
  public sommeDues: number;
  public totalFrais: number;
  public totalCommissions: number;
  public gains: number;

  constructor(
    vendeurId: string,
    sommeDues: number,
    totalFrais: number,
    totalCommissions: number,
    gains: number,
    _id: string
  ) {
    this.vendeurId = vendeurId;
    this.sommeDues = sommeDues;
    this.totalFrais = totalFrais;
    this.totalCommissions = totalCommissions;
    this.gains = gains;
    this._id = _id;
  }
}
