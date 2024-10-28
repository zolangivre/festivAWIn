interface TUtilisateur {
  idUtilisateur: number | null;
  nom: string;
  prenom: string;
  mail: string;
  telephone: string;
  adresse: string;
  role: string;
}

export class Utilisateur implements TUtilisateur {
  public idUtilisateur: number | null;
  public nom: string;
  public prenom: string;
  public mail: string;
  public telephone: string;
  public adresse: string;
  public role: string;

  constructor(nom : string, prenom : string, mail : string, telephone : string ="", adresse : string = "", role : string, idUtilisateur : number | null = null) {
    this.nom = nom;
    this.prenom = prenom;
    this.telephone = telephone;
    this.adresse = adresse;
    this.idUtilisateur = idUtilisateur;
    this.role = role;
    if (mail && !this.validateEmail(mail)) {
      throw new Error('Invalid email');
    }
    this.mail = mail;
  }

  private validateEmail(mail: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(mail);
  }
}
