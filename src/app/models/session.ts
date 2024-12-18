interface TSession {
  _id?: string;
  dateDebut: Date;
  dateFin: Date;
  fraisDepot: Number;
  statutSession: string;
}

export class Session implements TSession {
  public _id?: string;
  public dateDebut: Date;
  public dateFin: Date;
  public fraisDepot: Number;
  public statutSession: string;

  constructor(
    dateDebut: Date,
    dateFin: Date,
    fraisDepot: Number,
    statutSession: string = '',
    _id: string
  ) {
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.fraisDepot = fraisDepot;
    this.statutSession = statutSession;
    this._id = _id;
  }
}
