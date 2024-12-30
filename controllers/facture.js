const Vente = require('../models/vente');
const VenteJeu = require('../models/vente_jeu');
const Utilisateur = require('../models/utilisateur');
const PDFDocument = require('pdfkit');

const { format } = require('date-fns');
const { fr } = require('date-fns/locale');

exports.telechargerFacture = async (req, res) => {
    try {
        const venteId = req.params.venteId;
        const vente = await Vente.findById(venteId).populate('acheteur vendeur');
        if (!vente) {
            return res.status(404).json({ message: 'Vente non trouvée' });
        }

        const venteJeux = await VenteJeu.find({ idVente: venteId }).populate('idJeuDepot');
        const acheteur = await Utilisateur.findById(vente.acheteur);
        const vendeur = await Utilisateur.findById(vente.vendeur);

        const doc = new PDFDocument({ margin: 50 });
        let filename = `facture_${venteId}.pdf`;
        filename = encodeURIComponent(filename);

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        // En-tête
        doc.fontSize(16).font('Helvetica-Bold').text('Facture', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Facture ID: ${venteId}`, { align: 'right' });
        doc.text(`Date de facturation: ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, { align: 'right' });
        doc.moveDown(2);

        // Informations générales
        doc.fontSize(14).font('Helvetica-Bold').text('Informations de la vente');
        doc.moveDown();
        doc.fontSize(12).font('Helvetica')
            .text(`Acheteur: ${acheteur.nom} ${acheteur.prenom}`)
            .text(`Adresse: ${acheteur.adresse}`)
            .text(`Email: ${acheteur.mail}`)
            .text(`Téléphone: ${acheteur.telephone}`)
            .moveDown()
            .text(`Vendeur: ${vendeur.nom} ${vendeur.prenom}`)
            .moveDown()
            .text(`Date de vente: ${format(new Date(vente.dateVente), 'dd/MM/yyyy', { locale: fr })}`)
            .text(`Montant total: ${vente.montantTotal.toFixed(2)} €`);
        doc.moveDown(2);

        // Liste des jeux vendus
        doc.fontSize(14).font('Helvetica-Bold').text('Détails des jeux achetés');
        doc.moveDown();
        venteJeux.forEach((venteJeu, index) => {
            const jeuDepot = venteJeu.idJeuDepot;
            doc.fontSize(12).font('Helvetica')
                .text(`${index + 1}. ${jeuDepot.nomJeu}: ${venteJeu.quantiteVendus} x ${jeuDepot.prixJeu.toFixed(2)} €`);
        });
        doc.moveDown();

        // Signature ou note de bas de page
        doc.moveDown(3);
        doc.fontSize(10).font('Helvetica-Oblique').text('Merci pour votre achat !', { align: 'center' });

        doc.end();
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la génération de la facture', error });
    }
};
